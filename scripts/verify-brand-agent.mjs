/**
 * Smoke test for the on-site Brand Agent's playbook matcher
 * (src/lib/brand-agent/playbooks.ts).
 *
 * Run: node scripts/verify-brand-agent.mjs
 */
import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const outDir = await mkdtemp(join(tmpdir(), "brand-agent-test-"));
const outFile = join(outDir, "playbooks.mjs");

await build({
  entryPoints: ["src/lib/brand-agent/playbooks.ts"],
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile: outFile,
  logLevel: "silent",
});

const { PLAYBOOKS, matchPlaybook } = await import(pathToFileURL(outFile).href);
let passed = 0;

function ok(label, condition, extra = "") {
  assert.ok(condition, `${label}${extra ? ` — ${extra}` : ""}`);
  passed += 1;
  console.log(`  ✓ ${label}`);
}

console.log("Playbook library");
ok("Every playbook has exactly three agents", PLAYBOOKS.every((p) => p.agents.length === 3));
ok("Every playbook has at least two ad workflows and a visibility fix", PLAYBOOKS.every((p) => p.adWorkflows.length >= 2 && p.visibilityFix));
ok("Playbook ids are unique", new Set(PLAYBOOKS.map((p) => p.id)).size === PLAYBOOKS.length);
ok("Every agent names a tool the owner would run", PLAYBOOKS.every((p) => p.agents.every((a) => /ChatGPT Dot|Meta Muse|AI voice/.test(a.tool))));

console.log("\nFree-text matching");
const cases = [
  ["I own a med spa in Scottsdale doing Botox and laser", "med-spa"],
  ["We run a Shopify store selling candles", "shopify"],
  ["Family HVAC and plumbing company, 6 trucks", "home-services"],
  ["Two-location dental practice", "dental-health"],
  ["Neighborhood pizza restaurant with catering", "restaurant"],
  ["Small personal injury law firm", "professional-services"],
  ["Boutique pilates studio", "fitness"],
  ["medical clinic", "dental-health"],
];
for (const [text, expected] of cases) {
  const result = matchPlaybook(text);
  ok(`"${text}" → ${expected}`, result.playbook.id === expected && result.confident, `got ${result.playbook.id}`);
}

console.log("\nFallbacks");
{
  const vague = matchPlaybook("we help people");
  ok("Vague local description falls back to home services, not confident", vague.playbook.id === "home-services" && !vague.confident);
  const online = matchPlaybook("we ship orders nationwide");
  ok("E-commerce language falls back to the store playbook", online.playbook.id === "shopify" && !online.confident);
  const empty = matchPlaybook("");
  ok("Empty input still returns a playbook", Boolean(empty.playbook));
}

await rm(outDir, { recursive: true, force: true });
console.log(`\nAll ${passed} brand agent checks passed.`);
