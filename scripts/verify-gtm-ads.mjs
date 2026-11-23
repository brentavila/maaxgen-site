/**
 * Assert the GTM import is wired for Google Ads (container GTM-MF279RR2).
 * Run: node scripts/verify-gtm-ads.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gtmPath = join(root, "tracking/gtm/GTM-MF279RR2-import.json");
const consentPath = join(root, "src/components/analytics/ConsentManager.astro");
const layoutPath = join(root, "src/layouts/BaseLayout.astro");
const leadPath = join(root, "src/lib/tracking/lead.ts");

const PLACEHOLDER = /REPLACE_ME/;
let failed = 0;
const warnings = [];

function ok(cond, msg) {
  if (cond) {
    console.log(`ok  ${msg}`);
    return;
  }
  failed += 1;
  console.error(`FAIL ${msg}`);
}

function constValue(container, name) {
  const v = (container.variable || []).find((x) => x.name === name);
  return v?.parameter?.find((p) => p.key === "value")?.value;
}

function tagParam(tag, key) {
  return tag.parameter?.find((p) => p.key === key)?.value;
}

const gtm = JSON.parse(readFileSync(gtmPath, "utf8"));
const cv = gtm.containerVersion;
ok(cv?.container?.publicId === "GTM-MF279RR2", "container publicId is GTM-MF279RR2");

const tags = cv.tag || [];
const names = tags.map((t) => t.name);
ok(!tags.some((t) => /meta|facebook/i.test(t.name) || /facebook|fbq/i.test(JSON.stringify(t))), "no Meta/Facebook tags");

const googAds = tags.find((t) => t.name === "Google tag - Google Ads");
ok(googAds?.type === "googtag", "Google tag - Google Ads exists");
ok(tagParam(googAds, "tagId") === "AW-{{Const - AW Conversion ID}}", "Ads Google tag ID is AW- plus Const - AW Conversion ID");
ok(googAds?.firingTriggerId?.includes("2147479573"), "Ads Google tag fires on Initialization - All Pages");

const linker = tags.find((t) => t.name === "Conversion Linker");
ok(linker?.type === "gclidw", "Conversion Linker exists");
ok(linker?.firingTriggerId?.includes("2147479553"), "Conversion Linker fires on All Pages");

const lead = tags.find((t) => t.name === "Ads - Lead - form");
const booked = tags.find((t) => t.name === "Ads - Booked call");
const call = tags.find((t) => t.name === "Ads - Click to call");
ok(lead?.type === "awct", "Ads - Lead - form conversion tag");
ok(booked?.type === "awct", "Ads - Booked call conversion tag");
ok(call?.type === "awct", "Ads - Click to call conversion tag");
ok(tagParam(lead, "enableEnhancedConversion") === "true", "Lead form uses enhanced conversions");
ok(tagParam(lead, "cssProvidedEnhancedConversionValue") === "{{UPD - user_data}}", "Lead form reads UPD - user_data");
ok(tagParam(lead, "orderId") === "{{dlv - event_id}}", "Lead form transaction id is event_id");
ok(tagParam(booked, "orderId") === "{{dlv - event_id}}", "Booked call transaction id is event_id");

const awId = constValue(cv, "Const - AW Conversion ID");
ok(/^\d+$/.test(awId || ""), `Const - AW Conversion ID is digits only (${awId})`);
ok(!PLACEHOLDER.test(awId || ""), "AW Conversion ID is not a placeholder");

const leadLabel = constValue(cv, "Const - AW Label - Lead form");
const bookedLabel = constValue(cv, "Const - AW Label - Booked call");
const callLabel = constValue(cv, "Const - AW Label - Click to call");
ok(leadLabel && !PLACEHOLDER.test(leadLabel), `Lead form conversion label is set (${leadLabel})`);
ok(bookedLabel && !PLACEHOLDER.test(bookedLabel), `Booked call conversion label is set (${bookedLabel})`);
if (!callLabel || PLACEHOLDER.test(callLabel)) {
  warnings.push(
    "Const - AW Label - Click to call is still REPLACE_ME_CALL_LABEL. Create the secondary Google Ads conversion and paste its label, then re-import.",
  );
}

const triggers = cv.trigger || [];
ok(triggers.some((t) => t.name === "CE - generate_lead" && t.type === "CUSTOM_EVENT"), "CE - generate_lead trigger");
ok(triggers.some((t) => t.name === "CE - book_appointment" && t.type === "CUSTOM_EVENT"), "CE - book_appointment trigger");
ok(triggers.some((t) => t.name === "CE - click_to_call" && t.type === "CUSTOM_EVENT"), "CE - click_to_call trigger");

ok(names.includes("Google tag - GA4"), "GA4 Google tag still present");

const consent = readFileSync(consentPath, "utf8");
ok(consent.includes("gtm.js?id=${GTM_CONTAINER_ID}"), "ConsentManager loads gtm.js");
ok(consent.includes('gtag("consent", "default"'), "Consent Mode defaults run before GTM");
ok(!consent.includes("AW-"), "page does not hardcode a second AW gtag snippet");

const layout = readFileSync(layoutPath, "utf8");
ok(layout.includes("googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}"), "noscript GTM iframe is present");

const leadSrc = readFileSync(leadPath, "utf8");
ok(leadSrc.includes("eventCallback"), "submitLead waits on GTM eventCallback");
ok(
  /eventCallback: \(\) => release\(\)/.test(leadSrc) && leadSrc.includes("pushDataLayer({ user_data: undefined })"),
  "user_data is cleared in release() after GTM, not in a finally on the same tick",
);
ok(!/finally \{\s*pushDataLayer\(\{ user_data: undefined \}\)/.test(leadSrc), "no same-tick finally wipe of user_data");

for (const w of warnings) console.warn(`WARN ${w}`);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log(`\n${names.filter((n) => n.startsWith("Ads -") || n.includes("Google Ads") || n === "Conversion Linker").length} Google Ads tags verified`);
process.exit(0);
