/**
 * Server-only helpers for POST /api/lead: validation, hashing, CRM flattening, Meta CAPI body.
 * Pure functions (no network, no env reads) so they can be unit-checked. Never import from browser code:
 * this module uses node:crypto.
 */
import { createHash, randomUUID } from "node:crypto";
import {
  CLICK_ID_KEYS,
  CRM_KEYS,
  LEAD_VALUES,
  UTM_KEYS,
  type AttributionState,
  type BrowserIds,
  type LeadFormId,
  type LeadRequest,
  type Touch,
} from "./contract";
import { normalizePhoneE164 } from "./phone";

export { normalizePhoneE164 };

export const LEAD_FORM_IDS: readonly LeadFormId[] = [
  "contact",
  "plan_dialog",
  "industry",
  "bfcm_claim",
  "ad_grader",
  "growth_system",
];

/** Default Meta pixel (same id as src/lib/analytics/consent.ts). Env META_PIXEL_ID overrides. */
export const DEFAULT_META_PIXEL_ID = "1528990838912009";

export const META_GRAPH_VERSION = "v21.0";
export const MIN_ELAPSED_MS = 2500;

export type CrmKey = (typeof CRM_KEYS)[number];
export type CrmPayload = Record<CrmKey, string>;

// ---------------------------------------------------------------------------
// Hashing and normalization
// ---------------------------------------------------------------------------

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

/** Meta / Google normalization: trim + lowercase, then SHA-256. Empty input returns "". */
export function hashNormalized(value: string | undefined | null): string {
  const v = (value ?? "").trim().toLowerCase();
  return v ? sha256Hex(v) : "";
}

export function normalizeEmail(email: string | undefined | null): string {
  return (email ?? "").trim().toLowerCase();
}

/** Digits only, with country code, as Meta wants before hashing ("15551234567"). */
export function phoneDigitsForHash(phone: string | undefined | null): string {
  return normalizePhoneE164(phone).replace(/\D/g, "");
}

/** US zip: first five digits; otherwise lowercase with spaces and dashes removed. */
export function normalizeZip(zip: string | undefined | null): string {
  const v = (zip ?? "").trim().toLowerCase();
  if (!v) return "";
  const us = v.match(/^(\d{5})(?:[-\s]?\d{4})?$/);
  if (us) return us[1];
  return v.replace(/[\s-]/g, "");
}

/** Names: lowercase, trimmed, punctuation removed (Meta guidance), UTF-8 letters kept. */
export function normalizeName(name: string | undefined | null): string {
  return (name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\p{P}\p{S}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim()) && email.trim().length <= 254;
}

// ---------------------------------------------------------------------------
// Request validation
// ---------------------------------------------------------------------------

export type ValidationResult =
  | { kind: "ok"; lead: LeadRequest }
  | { kind: "bot"; reason: string }
  | { kind: "invalid"; error: string };

function str(v: unknown, max = 2000): string {
  if (v === undefined || v === null) return "";
  return String(v).slice(0, max);
}

function emptyTouch(): Touch {
  return { params: {}, source: "", medium: "", landingPage: "", referrer: "", at: "" };
}

function cleanTouch(v: unknown): Touch {
  if (!v || typeof v !== "object") return emptyTouch();
  const t = v as Record<string, unknown>;
  const params: Touch["params"] = {};
  const rawParams = (t.params && typeof t.params === "object" ? t.params : {}) as Record<string, unknown>;
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const val = str(rawParams[key], 500);
    if (val) params[key] = val;
  }
  return {
    params,
    source: str(t.source, 300),
    medium: str(t.medium, 300),
    landingPage: str(t.landingPage),
    referrer: str(t.referrer),
    at: str(t.at, 64),
  };
}

/** Parse an untrusted JSON body into a LeadRequest, or say why not. */
export function validateLeadRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") return { kind: "invalid", error: "Body must be a JSON object" };
  const b = body as Record<string, unknown>;

  // Bot checks first so bots get the same quiet 200 regardless of what else is wrong.
  if (str(b.hp).trim() !== "") return { kind: "bot", reason: "honeypot" };
  const elapsedMs = Number(b.elapsedMs);
  if (!Number.isFinite(elapsedMs) || elapsedMs < MIN_ELAPSED_MS) {
    return { kind: "bot", reason: `elapsedMs ${String(b.elapsedMs)} < ${MIN_ELAPSED_MS}` };
  }

  const c = (b.contact && typeof b.contact === "object" ? b.contact : {}) as Record<string, unknown>;
  const email = str(c.email, 254).trim();
  const firstName = str(c.firstName, 200).trim();
  if (!email) return { kind: "invalid", error: "Missing email" };
  if (!firstName) return { kind: "invalid", error: "Missing firstName" };
  if (!isValidEmail(email)) return { kind: "invalid", error: "Invalid email" };

  const formId = str(b.formId, 64) as LeadFormId;
  if (!LEAD_FORM_IDS.includes(formId)) return { kind: "invalid", error: "Unknown formId" };

  const fields: Record<string, string> = {};
  if (b.fields && typeof b.fields === "object") {
    for (const [k, v] of Object.entries(b.fields as Record<string, unknown>).slice(0, 100)) {
      if (v === undefined || v === null) continue;
      fields[str(k, 100)] = Array.isArray(v) ? v.map((x) => str(x, 500)).join(",") : str(v, 5000);
    }
  }

  const a = (b.attribution && typeof b.attribution === "object" ? b.attribution : {}) as Record<string, unknown>;
  const attribution: AttributionState = {
    first: cleanTouch(a.first),
    last: cleanTouch(a.last ?? a.first),
    sessions: Number.isFinite(Number(a.sessions)) ? Math.max(0, Math.floor(Number(a.sessions))) : 0,
  };

  const i = (b.ids && typeof b.ids === "object" ? b.ids : {}) as Record<string, unknown>;
  const ids: BrowserIds = {
    fbp: str(i.fbp, 300),
    fbc: str(i.fbc, 600),
    gaClientId: str(i.gaClientId, 100),
    gaSessionId: str(i.gaSessionId, 100),
    userAgent: str(i.userAgent, 1000),
    pageUrl: str(i.pageUrl),
    pageTitle: str(i.pageTitle, 500),
  };

  const consentRaw = (b.consent && typeof b.consent === "object" ? b.consent : {}) as Record<string, unknown>;
  const eventId = str(b.eventId, 100).trim();

  return {
    kind: "ok",
    lead: {
      eventId: eventId || randomUUID(),
      formId,
      leadSource: str(b.leadSource, 100).trim() || formId,
      contact: {
        firstName,
        lastName: str(c.lastName, 200).trim(),
        email,
        phone: str(c.phone, 50).trim(),
        company: str(c.company, 300).trim(),
        website: str(c.website, 500).trim(),
        zip: str(c.zip, 20).trim(),
      },
      fields,
      attribution,
      ids,
      // Missing consent is treated as granted: the site has a notice-only banner (see consent.ts).
      consent: { ads: consentRaw.ads !== false, analytics: consentRaw.analytics !== false },
      hp: "",
      elapsedMs,
      conversion: b.conversion !== false,
    },
  };
}

// ---------------------------------------------------------------------------
// CRM payload
// ---------------------------------------------------------------------------

/** `fields` keys that map to a CRM column. Both camelCase and snake_case spellings are accepted. */
const FIELD_TO_CRM: Record<string, CrmKey> = {
  message: "message",
  businessType: "business_type",
  business_type: "business_type",
  industry: "industry",
  qualifier: "qualifier",
  interestedServices: "interested_services",
  interested_services: "interested_services",
  promoId: "promo_id",
  promo_id: "promo_id",
  promoName: "promo_name",
  promo_name: "promo_name",
  smsConsent: "sms_consent",
  sms_consent: "sms_consent",
};

/** `_fbc` value from an fbclid: fb.1.<ms>.<fbclid>. */
export function buildFbc(fbclid: string, atMs: number = Date.now()): string {
  return fbclid ? `fb.1.${Math.floor(atMs)}.${fbclid}` : "";
}

/** The fbclid inside an fbc value "fb.<sub>.<ms>.<fbclid>"; "" when malformed. */
export function fbclidFromFbc(fbc: string): string {
  const m = fbc.match(/^fb\.\d+\.\d+\.(.+)$/);
  return m ? m[1] : "";
}

/**
 * ids.fbc, unless the last touch carries a different (newer) fbclid: then fbc is rebuilt from the
 * last-touch fbclid and its touch time. With no ids.fbc, built from the most recent fbclid.
 */
export function resolveFbc(lead: LeadRequest): string {
  const lastFbclid = lead.attribution.last.params.fbclid;
  if (lead.ids.fbc && lastFbclid && fbclidFromFbc(lead.ids.fbc) !== lastFbclid) {
    const at = Date.parse(lead.attribution.last.at);
    return buildFbc(lastFbclid, Number.isFinite(at) ? at : Date.now());
  }
  if (lead.ids.fbc) return lead.ids.fbc;
  for (const touch of [lead.attribution.last, lead.attribution.first]) {
    const fbclid = touch.params.fbclid;
    if (fbclid) {
      const at = Date.parse(touch.at);
      return buildFbc(fbclid, Number.isFinite(at) ? at : Date.now());
    }
  }
  return "";
}

/** First IP from x-forwarded-for, else x-real-ip. */
export function clientIpFromHeaders(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() ?? "";
}

/** Flat CRM payload with exactly CRM_KEYS, every key present ("" when unknown). */
export function buildCrmPayload(
  lead: LeadRequest,
  ctx: { ipAddress: string; userAgent?: string; submittedAt?: Date }
): CrmPayload {
  const out = Object.fromEntries(CRM_KEYS.map((k) => [k, ""])) as CrmPayload;
  const { contact, attribution, ids } = lead;
  const first = attribution.first;
  const last = attribution.last;

  out.event_id = lead.eventId;
  out.form_id = lead.formId;
  out.lead_source = lead.leadSource || lead.formId;
  out.submitted_at = (ctx.submittedAt ?? new Date()).toISOString();

  out.first_name = contact.firstName.trim();
  out.last_name = (contact.lastName ?? "").trim();
  out.full_name = [out.first_name, out.last_name].filter(Boolean).join(" ");
  out.email = normalizeEmail(contact.email);
  // E.164 when readable; otherwise keep what was typed so the CRM still has it.
  out.phone = normalizePhoneE164(contact.phone) || (contact.phone ?? "").trim();
  out.company = (contact.company ?? "").trim();
  out.website = (contact.website ?? "").trim();
  out.zip = (contact.zip ?? "").trim();

  const extra: Record<string, string> = {};
  for (const [key, value] of Object.entries(lead.fields)) {
    const crmKey = FIELD_TO_CRM[key];
    if (crmKey) {
      if (!out[crmKey]) out[crmKey] = value;
    } else {
      extra[key] = value;
    }
  }

  const touchCols = (t: Touch, prefix: "first" | "last") => {
    out[`${prefix}_source`] = t.params.utm_source || t.source;
    out[`${prefix}_medium`] = t.params.utm_medium || t.medium;
    out[`${prefix}_campaign`] = t.params.utm_campaign ?? "";
    out[`${prefix}_content`] = t.params.utm_content ?? "";
    out[`${prefix}_term`] = t.params.utm_term ?? "";
    out[`${prefix}_landing_page`] = t.landingPage;
    out[`${prefix}_referrer`] = t.referrer;
    out[`${prefix}_touch_at`] = t.at;
  };
  touchCols(first, "first");
  touchCols(last, "last");

  // Click ids: the latest touch that has one wins.
  for (const key of ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"] as const) {
    out[key] = last.params[key] || first.params[key] || "";
  }
  const liFatId = last.params.li_fat_id || first.params.li_fat_id;
  if (liFatId) extra.li_fat_id = liFatId;
  for (const t of [first, last]) {
    if (t.params.utm_id) extra[t === first ? "first_utm_id" : "last_utm_id"] = t.params.utm_id;
  }

  out.fbp = ids.fbp;
  out.fbc = resolveFbc(lead);
  out.ga_client_id = ids.gaClientId;
  out.ga_session_id = ids.gaSessionId;
  out.page_url = ids.pageUrl;
  out.user_agent = ids.userAgent || ctx.userAgent || "";
  out.ip_address = ctx.ipAddress;
  out.sessions = attribution.sessions ? String(attribution.sessions) : "";
  out.extra_json = Object.keys(extra).length ? JSON.stringify(extra) : "";

  return out;
}

// ---------------------------------------------------------------------------
// Meta Conversions API
// ---------------------------------------------------------------------------

export interface CapiEvent {
  event_name: "Lead";
  event_time: number;
  event_id: string;
  action_source: "website";
  event_source_url: string;
  user_data: Record<string, string>;
  custom_data: { value: number; currency: string; content_name: string; lead_source: string };
}

export interface CapiBody {
  data: CapiEvent[];
  test_event_code?: string;
}

/** One Meta CAPI "Lead" event. Hashes PII; ip, user agent, fbp, fbc stay unhashed (Meta's rules). */
export function buildCapiBody(
  lead: LeadRequest,
  ctx: { ipAddress: string; userAgent?: string; eventTime?: Date; testEventCode?: string }
): CapiBody {
  const email = normalizeEmail(lead.contact.email);
  const userData: Record<string, string> = {
    em: hashNormalized(email),
    ph: (() => {
      const d = phoneDigitsForHash(lead.contact.phone);
      return d ? sha256Hex(d) : "";
    })(),
    fn: hashNormalized(normalizeName(lead.contact.firstName)),
    ln: hashNormalized(normalizeName(lead.contact.lastName)),
    zp: hashNormalized(normalizeZip(lead.contact.zip)),
    country: hashNormalized("us"),
    external_id: hashNormalized(email),
    client_ip_address: ctx.ipAddress,
    client_user_agent: lead.ids.userAgent || ctx.userAgent || "",
    fbp: lead.ids.fbp,
    fbc: resolveFbc(lead),
  };
  for (const k of Object.keys(userData)) if (!userData[k]) delete userData[k];

  const body: CapiBody = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor((ctx.eventTime ?? new Date()).getTime() / 1000),
        event_id: lead.eventId,
        action_source: "website",
        event_source_url: lead.ids.pageUrl,
        user_data: userData,
        custom_data: {
          value: LEAD_VALUES[lead.formId] ?? 0,
          currency: "USD",
          content_name: lead.formId,
          lead_source: lead.leadSource || lead.formId,
        },
      },
    ],
  };
  if (ctx.testEventCode) body.test_event_code = ctx.testEventCode;
  return body;
}

export function capiUrl(pixelId: string, accessToken: string): string {
  return `https://graph.facebook.com/${META_GRAPH_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;
}

/** Same URL with the token replaced, for logs. */
export function redactedCapiUrl(pixelId: string): string {
  return capiUrl(pixelId, "REDACTED").replace("REDACTED", "[redacted]");
}
