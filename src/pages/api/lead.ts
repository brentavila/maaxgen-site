/**
 * POST /api/lead: the single server path for every lead (see src/lib/tracking/contract.ts).
 * Validates the LeadRequest, forwards a flat payload to the CRM webhook, and sends a Meta
 * Conversions API "Lead" in parallel. Runs as a Vercel function; every other page stays static.
 */
import type { APIRoute } from "astro";
import type { LeadResponse } from "../../lib/tracking/contract";
import {
  DEFAULT_META_PIXEL_ID,
  buildCapiBody,
  buildCrmPayload,
  capiUrl,
  clientIpFromHeaders,
  redactedCapiUrl,
  validateLeadRequest,
} from "../../lib/tracking/server";

export const prerender = false;

const OUTBOUND_TIMEOUT_MS = 6000;

/** Runtime env first (Vercel), then Vite/Astro env (.env files in `astro dev`). */
function env(name: string): string {
  const fromProcess = typeof process !== "undefined" ? process.env?.[name] : undefined;
  if (fromProcess) return fromProcess;
  // Static references so Vite/Astro can resolve them; dynamic import.meta.env[name] is not reliable.
  const fromVite: Record<string, string | undefined> = {
    LEAD_WEBHOOK_URL: import.meta.env.LEAD_WEBHOOK_URL,
    META_CAPI_ACCESS_TOKEN: import.meta.env.META_CAPI_ACCESS_TOKEN,
    META_PIXEL_ID: import.meta.env.META_PIXEL_ID,
    META_TEST_EVENT_CODE: import.meta.env.META_TEST_EVENT_CODE,
    TRACKING_DRY_RUN: import.meta.env.TRACKING_DRY_RUN,
  };
  return fromVite[name] ?? "";
}

function json(body: LeadResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

async function postJson(url: string, body: unknown): Promise<{ ok: boolean; status: number; text: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OUTBOUND_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, text: text.slice(0, 500) };
  } finally {
    clearTimeout(timer);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, mode: "dry-run", error: "Invalid JSON" }, 400);
  }

  const result = validateLeadRequest(body);
  if (result.kind === "bot") {
    console.warn(`[api/lead] bot reject (${result.reason}); nothing forwarded`);
    return json({ ok: true, mode: "dry-run" });
  }
  if (result.kind === "invalid") {
    return json({ ok: false, mode: "dry-run", error: result.error }, 400);
  }

  const lead = result.lead;
  const now = new Date();
  const ipAddress = clientIpFromHeaders(request.headers);
  const userAgent = request.headers.get("user-agent") ?? "";

  const crmPayload = buildCrmPayload(lead, { ipAddress, userAgent, submittedAt: now });

  const pixelId = env("META_PIXEL_ID") || DEFAULT_META_PIXEL_ID;
  const capiToken = env("META_CAPI_ACCESS_TOKEN");
  const testEventCode = env("META_TEST_EVENT_CODE");
  const capiBody = buildCapiBody(lead, { ipAddress, userAgent, eventTime: now, testEventCode });

  const webhookUrl = env("LEAD_WEBHOOK_URL");
  const dryRun = env("TRACKING_DRY_RUN") === "1" || (import.meta.env.DEV && !webhookUrl);

  if (dryRun) {
    console.log(`[api/lead] DRY RUN: nothing forwarded (event_id ${lead.eventId})`);
    console.log("[api/lead] CRM payload:\n" + JSON.stringify(crmPayload, null, 2));
    if (lead.conversion === false) {
      console.log("[api/lead] CAPI: would skip (conversion: false)");
    } else if (!lead.consent.ads) {
      console.log("[api/lead] CAPI: would skip (consent.ads is false)");
    } else {
      console.log(
        `[api/lead] CAPI POST ${redactedCapiUrl(pixelId)}${capiToken ? "" : " (token not set; would skip)"}\n` +
          JSON.stringify(capiBody, null, 2)
      );
    }
    return json({ ok: true, mode: "dry-run" });
  }

  if (!webhookUrl) {
    // No silent fallback: a missing variable must be visible, not routed somewhere stale.
    // The form shows its error state, and nothing is sent to Meta for a lead the CRM never got.
    console.error(
      `[api/lead] LEAD_WEBHOOK_URL is not set on this deployment; lead NOT delivered (event_id ${lead.eventId}). ` +
        "Set it in Vercel > Project > Settings > Environment Variables and redeploy."
    );
    return json({ ok: false, mode: "sent", error: "Lead delivery is not configured" }, 503);
  }

  const crmTask = postJson(webhookUrl, crmPayload);

  let capiTask: Promise<unknown> = Promise.resolve();
  if (lead.conversion === false) {
    console.log(`[api/lead] CAPI skipped: conversion false (event_id ${lead.eventId})`);
  } else if (!lead.consent.ads) {
    console.log(`[api/lead] CAPI skipped: consent.ads false (event_id ${lead.eventId})`);
  } else if (!capiToken) {
    console.warn(`[api/lead] CAPI skipped: META_CAPI_ACCESS_TOKEN not set (event_id ${lead.eventId})`);
  } else {
    capiTask = postJson(capiUrl(pixelId, capiToken), capiBody).then(
      (r) => {
        if (!r.ok) console.error(`[api/lead] CAPI failed ${r.status}: ${r.text}`);
      },
      (err) => console.error(`[api/lead] CAPI error: ${err instanceof Error ? err.message : String(err)}`)
    );
  }

  const [crm] = await Promise.allSettled([crmTask, capiTask]);

  if (crm.status === "rejected") {
    const msg = crm.reason instanceof Error ? crm.reason.message : String(crm.reason);
    console.error(`[api/lead] CRM forward error (event_id ${lead.eventId}): ${msg}`);
    return json({ ok: false, mode: "sent", error: "Lead could not be delivered" }, 502);
  }
  if (!crm.value.ok) {
    console.error(`[api/lead] CRM forward failed ${crm.value.status} (event_id ${lead.eventId}): ${crm.value.text}`);
    return json({ ok: false, mode: "sent", error: "Lead could not be delivered" }, 502);
  }
  return json({ ok: true, mode: "sent" });
};

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, mode: "dry-run", error: "Method not allowed" } satisfies LeadResponse), {
    status: 405,
    headers: { "Content-Type": "application/json", Allow: "POST" },
  });
