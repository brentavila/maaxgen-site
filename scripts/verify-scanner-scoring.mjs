/**
 * Smoke test for the AI & Agent Readiness Scanner's pure logic
 * (src/lib/scanner/detect.ts + score.ts): walks fixture sites through
 * detection and scoring and asserts the grades and headlines land where expected.
 *
 * Run: node scripts/verify-scanner-scoring.mjs
 */
import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const outDir = await mkdtemp(join(tmpdir(), "scanner-test-"));
const outFile = join(outDir, "scanner.mjs");

await build({
  stdin: {
    contents: `export * from "./src/lib/scanner/detect.ts"; export * from "./src/lib/scanner/score.ts"; export * from "./src/lib/scanner/demo.ts";`,
    resolveDir: process.cwd(),
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile: outFile,
  logLevel: "silent",
});

const scanner = await import(pathToFileURL(outFile).href);
const { detectFromResourceUrls, signalsFromPsi, mergeSignals, buildReport, DEMO_SIGNALS, demoRecommendability, emptySignals } = scanner;

const input = { url: "https://example.com/", businessName: "Example Dental", city: "Austin, TX", email: "owner@example.com" };
let passed = 0;

function section(title) {
  console.log(`\n${title}`);
}

function ok(label, condition, extra = "") {
  assert.ok(condition, `${label}${extra ? ` — ${extra}` : ""}`);
  passed += 1;
  console.log(`  ✓ ${label}`);
}

// ---------------------------------------------------------------- detection

section("Detection from resource URLs");
{
  const urls = [
    "https://connect.facebook.net/en_US/fbevents.js",
    "https://www.googletagmanager.com/gtm.js?id=GTM-ABC123",
    "https://www.googletagmanager.com/gtag/js?id=G-XYZ",
    "https://cdn.shopify.com/s/files/1/0001/theme.js",
    "https://shop.app/pay/checkout.js",
    "https://widgets.leadconnectorhq.com/loader.js",
    "https://www.google.com/recaptcha/api.js",
    "https://assets.calendly.com/assets/external/widget.js",
  ];
  const s = detectFromResourceUrls(urls);
  ok("Meta Pixel detected", s.metaPixel === true);
  ok("GTM detected", s.gtm === true);
  ok("GA4 detected", s.ga4 === true);
  ok("Shopify detected", s.ecommercePlatform === "Shopify");
  ok("Shop Pay detected", s.shopPay === true);
  ok("Chat widget named", s.chatWidget === "LeadConnector Chat", s.chatWidget);
  ok("reCAPTCHA named", s.captcha === "reCAPTCHA");
  ok("Calendly booking detected", s.bookingTool === "Calendly");
  ok("Google-hosted GTM is not server-side", s.serverSideTagging === false);
  ok("No bot challenge", s.botChallenge === false);
}

{
  const bare = detectFromResourceUrls(["https://example.com/app.js", "https://fonts.googleapis.com/css2?family=X"]);
  ok("Empty observation yields definite negatives", bare.metaPixel === false && bare.chatWidget === "" && bare.bookingTool === "");
}

{
  const sgtm = detectFromResourceUrls(["https://gtm.example.com/gtm.js?id=GTM-SS1", "https://example.com/cdn-cgi/challenge-platform/h/b/orchestrate/jsd/v1"]);
  ok("First-party GTM host counts as server-side tagging", sgtm.serverSideTagging === true);
  ok("Cloudflare challenge platform flagged", sgtm.botChallenge === true);
  const stape = detectFromResourceUrls(["https://load.stape.io/abc/gtm.js?id=GTM-1"]);
  ok("stape.io counts as server-side tagging", stape.serverSideTagging === true);
}

section("Signals from a PageSpeed Insights payload");
{
  const psi = {
    lighthouseResult: {
      categories: { performance: { score: 0.38 } },
      audits: {
        viewport: { score: 1 },
        "is-crawlable": { score: 1 },
        "robots-txt": { score: 1 },
        "largest-contentful-paint": { numericValue: 5230 },
        "network-requests": { details: { items: [{ url: "https://example.com/" }, { url: "https://connect.facebook.net/en_US/fbevents.js" }] } },
      },
    },
  };
  const s = signalsFromPsi(psi);
  ok("Performance score rounded to 38", s.performanceScore === 38);
  ok("LCP rounded to 5.2s", s.lcpSeconds === 5.2, String(s.lcpSeconds));
  ok("Mobile friendly from viewport audit", s.mobileFriendly === true);
  ok("Crawlable from audits", s.crawlable === true);
  ok("Pixel detected through PSI network requests", s.metaPixel === true);
}

section("Merging sources");
{
  const merged = mergeSignals(
    { metaPixel: true, chatWidget: "Podium", crawlable: null },
    { metaPixel: false, chatWidget: "", crawlable: false },
  );
  ok("Presence is OR-ed across sources", merged.metaPixel === true);
  ok("Named tool survives a sparser 'none'", merged.chatWidget === "Podium");
  ok("Null never overwrites a known value", merged.crawlable === false);
}

// ----------------------------------------------------------------- scoring

section("Scoring: nothing measured");
{
  const report = buildReport(input, emptySignals(), { available: false }, []);
  ok("Every pillar is pending", report.pillars.every((p) => p.score === null));
  ok("Report is provisional with 0 measured checks", report.provisional && report.measuredChecks === 0);
  ok("Still offers three next moves", report.nextMoves.length === 3);
  ok("Does not pretend to grade an empty scan", report.label === "Scan pending" && /could not complete/.test(report.headline));
}

section("Scoring: demo fixture (typical SMB)");
{
  const report = buildReport(input, DEMO_SIGNALS, demoRecommendability(input.businessName, input.city), ["sample"]);
  console.log(`  score=${report.score} grade=${report.grade} headline="${report.headline}"`);
  ok("Lands in the D range", report.grade === "D", `${report.score}`);
  ok("Headline names the competitors AI chose", /Northside Comfort Pros and Reliable Home Experts/.test(report.headline));
  ok("Not provisional (all pillars measured)", report.provisional === false);
  const friction = report.pillars.find((p) => p.id === "friction");
  const pricing = friction.checks.find((c) => c.id === "pricingLegible");
  ok("'Call for quote' fails the pricing check", pricing.status === "fail");
  const bot = friction.checks.find((c) => c.id === "noBotBlock");
  ok("reCAPTCHA alone is a warning, not a failure", bot.status === "warn");
  ok("Top next move targets AI recommendation (highest failed weight)", /evidence AI engines look for/.test(report.nextMoves[0]));
}

section("Scoring: AI-ready site");
{
  const strong = {
    ...emptySignals(),
    metaPixel: true, gtm: true, ga4: true, serverSideTagging: true,
    chatWidget: "Podium", bookingTool: "Calendly", ecommercePlatform: "", shopPay: false,
    captcha: "", botChallenge: false,
    mobileFriendly: true, crawlable: true, performanceScore: 91, lcpSeconds: 1.4,
    schemaTypes: ["LocalBusiness", "Service", "Offer"], pricingVisible: true, callForQuote: false, phoneVisible: true, hoursVisible: true,
  };
  const rec = { available: true, summary: "A family dental practice in Austin offering cleanings, implants, and Invisalign.", query: "best dentist in Austin", mentioned: true, competitors: ["Example Dental", "Other Dental"], confidence: "high" };
  const report = buildReport(input, strong, rec, ["api", "psi"]);
  console.log(`  score=${report.score} grade=${report.grade} headline="${report.headline}"`);
  ok("Perfect inputs score 100 / A", report.score === 100 && report.grade === "A");
  ok("No failed checks", report.pillars.every((p) => p.checks.every((c) => c.status !== "fail")));
  ok("Headline celebrates the recommendation", /already recommends you/.test(report.headline), report.headline);
}

section("Scoring: PSI only (no scanner API)");
{
  const psiOnly = mergeSignals(detectFromResourceUrls(["https://example.com/app.js"]), { mobileFriendly: true, crawlable: true, performanceScore: 72 });
  const report = buildReport(input, psiOnly, { available: false }, ["psi"]);
  console.log(`  score=${report.score} grade=${report.grade} headline="${report.headline}"`);
  const rec = report.pillars.find((p) => p.id === "recommendability");
  ok("Recommendability pillar is pending", rec.score === null);
  ok("Report is provisional", report.provisional === true);
  ok("Headline calls out blind ads when no tracking is found", /running blind/.test(report.headline));
  const signals = report.pillars.find((p) => p.id === "signals");
  ok("Signals pillar scores zero", signals.score === 0);
  ok("Overall score excludes the pending pillar", report.score === Math.round(((report.pillars[1].score + 0) / (35 + 30)) * 100));
}

section("Scoring: crawl-blocked site");
{
  const blocked = { ...emptySignals(), crawlable: false, mobileFriendly: true, performanceScore: 80, metaPixel: true, gtm: true, ga4: false, serverSideTagging: false, chatWidget: "" };
  const report = buildReport(input, blocked, { available: false }, ["psi"]);
  ok("Headline prioritises the crawl block", /not allowed to read/.test(report.headline), report.headline);
  ok("Next moves lead with removing the block", /noindex|robots/.test(report.nextMoves[0]), report.nextMoves[0]);
}

await rm(outDir, { recursive: true, force: true });
console.log(`\nAll ${passed} scanner checks passed.`);
