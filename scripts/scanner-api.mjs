/**
 * Reference backend for the AI & Agent Readiness Scanner (/ai-readiness-scanner).
 *
 * The marketing site is static, so anything that needs a secret or a cross-origin
 * fetch lives here. Deploy this anywhere Node 22 runs (Cloud Run, Fly, Render, a VPS)
 * and set PUBLIC_SCANNER_API_URL on the site to its /scan endpoint.
 *
 *   POST /scan  { url, businessName, city }
 *   -> ScannerApiResponse (see src/lib/scanner/types.ts)
 *
 * Environment:
 *   PORT                    default 8787
 *   OPENAI_API_KEY          enables the live "what does ChatGPT think you sell" test
 *   OPENAI_MODEL            default gpt-4o-mini
 *   SCANNER_ALLOWED_ORIGIN  CORS origin, default "*"
 *   SCANNER_FETCH_TIMEOUT   ms to wait for the target site, default 12000
 *
 * Run locally: OPENAI_API_KEY=sk-... node scripts/scanner-api.mjs
 * No dependencies; uses only Node built-ins and global fetch.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const ALLOWED_ORIGIN = process.env.SCANNER_ALLOWED_ORIGIN || "*";
const FETCH_TIMEOUT = Number(process.env.SCANNER_FETCH_TIMEOUT || 12000);

const AGENT_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 MaaxGenReadinessScanner/1.0";

// ------------------------------------------------------------------ HTML pass

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}

function absolutize(candidate, base) {
  try {
    return new URL(candidate, base).toString();
  } catch {
    return "";
  }
}

export function extractResourceUrls(html, baseUrl) {
  const urls = new Set();
  const attrPattern = /<(?:script|iframe|img|link)\b[^>]*?\s(?:src|href|data-src)\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = attrPattern.exec(html))) {
    const url = absolutize(match[1], baseUrl);
    if (url) urls.add(url);
  }
  // Inline tag snippets reference hosts without a src attribute.
  const inlinePattern = /https?:\/\/[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s"'<>)]*)?/gi;
  const inlineScripts = html.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [];
  for (const script of inlineScripts) {
    for (const url of script.match(inlinePattern) || []) urls.add(url);
  }
  if (/fbq\s*\(\s*['"]init['"]/.test(html)) urls.add("https://connect.facebook.net/en_US/fbevents.js");
  if (/GTM-[A-Z0-9]{4,}/.test(html) && /googletagmanager/.test(html)) urls.add("https://www.googletagmanager.com/gtm.js?id=GTM-INLINE");
  return Array.from(urls);
}

export function extractSchemaTypes(html) {
  const types = new Set();
  const blocks = html.match(/<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of blocks) {
    const body = block.replace(/^<script[^>]*>/i, "").replace(/<\/script>$/i, "");
    try {
      const parsed = JSON.parse(body);
      const walk = (node) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) return node.forEach(walk);
        const type = node["@type"];
        if (typeof type === "string") types.add(type);
        if (Array.isArray(type)) type.forEach((t) => typeof t === "string" && types.add(t));
        for (const value of Object.values(node)) if (value && typeof value === "object") walk(value);
      };
      walk(parsed);
    } catch {
      for (const found of body.match(/"@type"\s*:\s*"([^"]+)"/g) || []) {
        const type = found.match(/"([^"]+)"\s*$/);
        if (type) types.add(type[1]);
      }
    }
  }
  for (const found of html.match(/itemtype\s*=\s*["']https?:\/\/schema\.org\/([A-Za-z]+)["']/gi) || []) {
    const type = found.match(/schema\.org\/([A-Za-z]+)/i);
    if (type) types.add(type[1]);
  }
  return Array.from(types);
}

export function analyzeHtml(html, baseUrl) {
  const text = stripTags(html);
  const title = decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]).trim().slice(0, 200);
  const description = decodeEntities(
    (html.match(/<meta[^>]+name\s*=\s*["']description["'][^>]+content\s*=\s*["']([^"']*)["']/i) ||
      html.match(/<meta[^>]+content\s*=\s*["']([^"']*)["'][^>]+name\s*=\s*["']description["']/i) || [, ""])[1],
  )
    .trim()
    .slice(0, 300);

  const priceMatches = text.match(/(?:\$|USD\s?)\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g) || [];
  const startingAt = /\b(?:starting at|from|as low as|per (?:hour|visit|session|month))\b/i.test(text);
  const callForQuote = /\b(?:call (?:us )?for (?:a )?(?:quote|pricing|price|estimate)|contact (?:us )?for (?:a )?(?:quote|pricing|price)|request (?:a )?(?:free )?quote|get (?:a )?(?:free )?quote|pricing (?:on|upon) request)\b/i.test(text);
  const phoneVisible = /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(text) || /href=["']tel:/i.test(html);
  const hoursVisible = /\b(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?\s*(?:-|–|to|through)?\s*(?:mon|tue|wed|thu|fri|sat|sun)?[a-z]*\.?\s*:?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)/i.test(text) || /\b(?:open|hours)\b[^.]{0,40}\d{1,2}\s*(?:am|pm)/i.test(text);

  return {
    title,
    description,
    text: text.slice(0, 4000),
    schemaTypes: extractSchemaTypes(html),
    pricingVisible: priceMatches.length >= 2 || (priceMatches.length >= 1 && startingAt),
    callForQuote,
    phoneVisible,
    hoursVisible,
    resourceUrls: extractResourceUrls(html, baseUrl),
  };
}

async function fetchOnce(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": AGENT_UA, Accept: "text/html,application/xhtml+xml" },
    });
    const html = await response.text();
    return { status: response.status, finalUrl: response.url || url, html: html.slice(0, 2_000_000) };
  } finally {
    clearTimeout(timer);
  }
}

/** Sites without TLS still exist; if https fails at the network layer, retry over http. */
async function fetchSite(url) {
  try {
    return await fetchOnce(url);
  } catch (error) {
    if (!/^https:/i.test(url) || error.name === "AbortError") throw error;
    const insecure = url.replace(/^https:/i, "http:");
    const result = await fetchOnce(insecure);
    return { ...result, insecure: true };
  }
}

// ------------------------------------------------------- recommendability test

async function recommendabilityTest({ businessName, city, url, title, description, text }) {
  if (!OPENAI_API_KEY) return { available: false };

  const system =
    "You are simulating how a consumer AI assistant answers shopping questions. Answer only from your own prior knowledge. Do not use the page excerpt to answer the familiarity question; use it only to infer the business category. Respond with strict JSON.";
  const user = `Business: "${businessName}" in ${city} (website ${url}).
Page title: ${title || "n/a"}
Meta description: ${description || "n/a"}
Page excerpt (for category inference only): ${text.slice(0, 1200)}

Return JSON with these keys:
- "inferredService": the business category in 2-4 plain words (e.g. "med spa", "roofing contractor", "women's boutique").
- "query": a natural consumer query of the form "best <inferredService> in <city>".
- "summary": in one or two sentences, what you (from prior knowledge only) believe this specific business sells and who it serves. If you have no reliable knowledge of it, say so plainly.
- "confidence": "high" | "medium" | "low" — your familiarity with this specific business from prior knowledge.
- "recommendations": array of up to 5 business names you would recommend for "query", from prior knowledge, most likely first.
- "mentioned": true if "${businessName}" (or an obvious variant) is in "recommendations".`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!response.ok) throw new Error(`openai ${response.status}`);
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations.filter((r) => typeof r === "string") : [];
  const nameNeedle = businessName.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const mentioned =
    parsed.mentioned === true ||
    recommendations.some((r) => r.toLowerCase().replace(/[^a-z0-9]+/g, " ").includes(nameNeedle));

  return {
    available: true,
    provider: `openai:${OPENAI_MODEL}`,
    summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
    inferredService: typeof parsed.inferredService === "string" ? parsed.inferredService : "",
    query: typeof parsed.query === "string" ? parsed.query : `best ${parsed.inferredService || "business"} in ${city}`,
    confidence: ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "low",
    mentioned,
    competitors: recommendations.filter((r) => !r.toLowerCase().replace(/[^a-z0-9]+/g, " ").includes(nameNeedle)).slice(0, 5),
  };
}

// ------------------------------------------------------------------- server

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 64_000) reject(new Error("payload too large"));
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

export async function personalize({ business, playbook }) {
  if (!OPENAI_API_KEY) return { ok: false, error: "openai disabled" };
  if (!playbook || !Array.isArray(playbook.agents) || playbook.agents.length !== 3) {
    return { ok: false, error: "missing playbook" };
  }

  const description = String(business || "").slice(0, 400);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You rewrite a marketing agency's implementation plan so it names the visitor's specific business. Keep the same three agents, the same tools, and the same two ad workflows. Do not invent prices, guarantees, or tools that are not already in the plan. Respond with strict JSON.",
        },
        {
          role: "user",
          content: `Visitor said: "${description}"
Playbook label: ${playbook.label}
Current plan JSON:
${JSON.stringify({
  hook: playbook.hook,
  agents: playbook.agents,
  adWorkflows: playbook.adWorkflows,
  visibilityFix: playbook.visibilityFix,
})}

Return JSON with keys hook (one sentence), agents (exactly 3 objects with name, tool, does, saves), adWorkflows (same length, objects with title and detail), visibilityFix (one sentence). Keep each tool string identical to the input.`,
        },
      ],
    }),
  });
  if (!response.ok) throw new Error(`openai ${response.status}`);
  const data = await response.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
  if (!Array.isArray(parsed.agents) || parsed.agents.length !== 3) return { ok: false, error: "bad plan" };

  const agents = parsed.agents.map((agent, index) => ({
    name: String(agent.name || playbook.agents[index].name).slice(0, 80),
    tool: playbook.agents[index].tool,
    does: String(agent.does || playbook.agents[index].does).slice(0, 400),
    saves: String(agent.saves || playbook.agents[index].saves).slice(0, 120),
  }));

  return {
    ok: true,
    plan: {
      hook: String(parsed.hook || playbook.hook).slice(0, 400),
      agents,
      adWorkflows: Array.isArray(parsed.adWorkflows)
        ? parsed.adWorkflows.slice(0, playbook.adWorkflows.length).map((flow, index) => ({
            title: String(flow.title || playbook.adWorkflows[index]?.title || "").slice(0, 80),
            detail: String(flow.detail || playbook.adWorkflows[index]?.detail || "").slice(0, 400),
          }))
        : playbook.adWorkflows,
      visibilityFix: String(parsed.visibilityFix || playbook.visibilityFix).slice(0, 400),
    },
  };
}

export async function scan({ url, businessName, city }) {
  let target;
  try {
    target = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
  } catch {
    return { ok: false, error: "invalid url" };
  }
  if (!/^https?:$/.test(target.protocol) || !target.hostname.includes(".")) return { ok: false, error: "invalid url" };

  const site = await fetchSite(target.toString());
  const html = analyzeHtml(site.html, site.finalUrl);

  let recommendability = { available: false };
  try {
    recommendability = await recommendabilityTest({
      businessName: String(businessName || target.hostname),
      city: String(city || ""),
      url: site.finalUrl,
      title: html.title,
      description: html.description,
      text: html.text,
    });
  } catch (error) {
    recommendability = { available: false };
    console.warn("recommendability test failed:", error.message);
  }

  const challenged = site.status === 403 || site.status === 503 || /cf-browser-verification|challenge-platform|Just a moment\.\.\./i.test(site.html);
  if (challenged) html.resourceUrls.push(`${site.finalUrl.replace(/\/$/, "")}/cdn-cgi/challenge-platform/detected`);

  return {
    ok: true,
    finalUrl: site.finalUrl,
    status: site.status,
    resourceUrls: html.resourceUrls,
    html: {
      title: html.title,
      description: html.description,
      schemaTypes: html.schemaTypes,
      pricingVisible: html.pricingVisible,
      callForQuote: html.callForQuote,
      phoneVisible: html.phoneVisible,
      hoursVisible: html.hoursVisible,
    },
    recommendability,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createServer(async (req, res) => {
    if (req.method === "OPTIONS") return send(res, 204, {});
    if (req.method === "GET" && req.url === "/health") return send(res, 200, { ok: true, openai: Boolean(OPENAI_API_KEY) });
    if (req.method === "POST" && req.url?.startsWith("/agent")) {
      try {
        const body = await readJson(req);
        const result = await personalize(body);
        return send(res, result.ok ? 200 : 400, result);
      } catch (error) {
        console.error("personalize failed:", error);
        return send(res, 502, { ok: false, error: "personalize failed" });
      }
    }
    if (req.method !== "POST" || !req.url?.startsWith("/scan")) return send(res, 404, { ok: false, error: "not found" });

    try {
      const body = await readJson(req);
      const result = await scan(body);
      send(res, result.ok ? 200 : 400, result);
    } catch (error) {
      console.error("scan failed:", error);
      send(res, 502, { ok: false, error: error.name === "AbortError" ? "site did not respond in time" : "scan failed" });
    }
  }).listen(PORT, () => {
    console.log(`scanner api listening on :${PORT} (openai ${OPENAI_API_KEY ? "enabled" : "disabled"})`);
  });
}
