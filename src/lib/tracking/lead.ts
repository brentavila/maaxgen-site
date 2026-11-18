/**
 * submitLead(): the one way a form creates a lead (contract.ts architecture).
 * POSTs the LeadRequest to /api/lead; only on ok does it fire the browser conversions
 * (dataLayer user_data + generate_lead, Meta Lead with the same event id for CAPI dedupe).
 */
import { LEAD_VALUES, type LeadContact, type LeadFormId, type LeadRequest, type LeadResponse } from "./contract";
import { getAttribution } from "./attribution";
import { getConsent } from "./consent";
import { getBrowserIds } from "./ids";
import { normalizePhoneE164 } from "./phone";
import { newEventId, pushDataLayer, track } from "./track";

export interface SubmitLeadInput {
  formId: LeadFormId;
  /** CRM lead source; defaults to formId. Promo forms pass the promo id (for example "bfcm-2026"). */
  leadSource?: string;
  contact: LeadContact;
  /** Every other value the form collected, flat strings (message, businessType, promoId, ...). */
  fields: Record<string, string>;
  /** Honeypot input value; must be "". */
  hp: string;
  /** Date.now() at the first interaction with the form (focus or first input). */
  startedAt: number;
  /** Default true. false = CRM only: no generate_lead / user_data / Meta Lead here and no server CAPI. */
  conversion?: boolean;
}

export const LEAD_ENDPOINT = "/api/lead";

/**
 * Submit a lead. Resolves with the server's LeadResponse (check `.ok`); rejects only on network
 * failure so the form can show its error state. Browser conversions fire only when `ok` is true
 * and `conversion` is not false; in that case it resolves only after GTM reports the generate_lead
 * tags fired (eventCallback) or 1.2 s passes, so callers can navigate right after it resolves.
 */
export async function submitLead(input: SubmitLeadInput): Promise<LeadResponse> {
  const eventId = newEventId();
  const leadSource = input.leadSource || input.formId;

  // Tracking context is best effort; a failure here must not block the lead.
  let attribution: LeadRequest["attribution"];
  let ids: LeadRequest["ids"];
  let consent: LeadRequest["consent"];
  try {
    attribution = getAttribution();
  } catch {
    attribution = undefined as unknown as LeadRequest["attribution"];
  }
  try {
    ids = getBrowserIds();
  } catch {
    ids = undefined as unknown as LeadRequest["ids"];
  }
  try {
    consent = getConsent();
  } catch {
    consent = { ads: true, analytics: true };
  }

  const request: LeadRequest = {
    eventId,
    formId: input.formId,
    leadSource,
    contact: input.contact,
    fields: input.fields ?? {},
    attribution,
    ids,
    consent,
    hp: input.hp ?? "",
    elapsedMs: Math.max(0, Date.now() - (input.startedAt || Date.now())),
    conversion: input.conversion !== false,
  };

  const res = await fetch(LEAD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  let response: LeadResponse;
  try {
    response = (await res.json()) as LeadResponse;
  } catch {
    response = { ok: false, mode: "sent", error: `HTTP ${res.status}` };
  }
  if (!res.ok && response.ok) response = { ok: false, mode: response.mode, error: `HTTP ${res.status}` };

  if (response.ok && request.conversion !== false) await fireLeadConversion(request);
  return response;
}

/** Max wait for GTM's eventCallback before resolving anyway (GTM missing, blocked, or slow). */
const CONVERSION_WAIT_MS = 1200;

function fireLeadConversion(req: LeadRequest): Promise<void> {
  let release: () => void = () => {};
  const done = new Promise<void>((resolve) => {
    let settled = false;
    release = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    setTimeout(release, CONVERSION_WAIT_MS);
  });
  try {
    const c = req.contact;
    pushDataLayer({
      user_data: {
        email: c.email.trim().toLowerCase(),
        phone_number: normalizePhoneE164(c.phone) || undefined,
        address: {
          first_name: c.firstName.trim(),
          last_name: (c.lastName ?? "").trim() || undefined,
          postal_code: (c.zip ?? "").trim() || undefined,
          country: "US",
        },
      },
    });
    const f = req.fields;
    track("generate_lead", {
      event_id: req.eventId,
      form_id: req.formId,
      lead_source: req.leadSource,
      value: LEAD_VALUES[req.formId],
      currency: "USD",
      industry: f.industry,
      business_type: f.businessType ?? f.business_type,
      interested_services: f.interestedServices ?? f.interested_services,
      promo_id: f.promoId ?? f.promo_id,
    }, { eventCallback: () => release(), eventTimeout: CONVERSION_WAIT_MS });
    // Meta Lead fired synchronously inside track(), before we wait on GTM.
  } catch {
    release();
  } finally {
    pushDataLayer({ user_data: undefined });
  }
  return done;
}
