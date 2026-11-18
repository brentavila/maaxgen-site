/**
 * Tracking contract for maaxgen.com. Written by the conductor; workers build against it.
 *
 * Architecture (one path for every conversion):
 *
 *   browser form ──submitLead()──▶ POST /api/lead (Vercel function, same origin)
 *        │                              ├─▶ GHL inbound webhook or n8n (env LEAD_WEBHOOK_URL)
 *        │                              └─▶ Meta Conversions API  "Lead", event_id = E
 *        ├─▶ dataLayer {event:"generate_lead", event_id:E, user_data}  ─▶ GTM ─▶ GA4 + Google Ads
 *        │                                                                   (enhanced conversions)
 *        └─▶ fbq("track","Lead",{...},{eventID:E})   (browser pixel; Meta dedupes with CAPI on E)
 *
 * Rules
 * - The Meta Pixel stays hardcoded in ConsentManager.astro and is fired ONLY by src/lib/tracking.
 *   The GTM container must contain NO Meta tags (that would double count).
 * - GA4 and Google Ads fire ONLY from GTM, reading the dataLayer events below.
 * - No component calls fbq, gtag, or dataLayer.push directly. Everything goes through
 *   track() or submitLead() in src/lib/tracking/.
 * - Analytics never breaks a form: every tracking call is wrapped; the lead POST is what matters.
 * - No webhook URL ships in the client bundle.
 * - Tests never hit the live webhook or Meta: /api/lead runs in dry-run when
 *   TRACKING_DRY_RUN=1 or when running `astro dev` without LEAD_WEBHOOK_URL set.
 */

/** Cookie domain shared by maaxgen.com and every subdomain. */
export const COOKIE_DOMAIN = ".maaxgen.com";

/** First-party attribution cookie and its lifetime. */
export const ATTRIBUTION_COOKIE = "mx_attr";
export const ATTRIBUTION_MAX_AGE_DAYS = 90;

/** Click ids captured from the landing URL. */
export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid", "li_fat_id"] as const;
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"] as const;

/** One touch: the landing that started a visit with a campaign signal (or the first visit ever). */
export interface Touch {
  /** utm_* and click ids exactly as they appeared in the URL, snake_case keys. Missing keys omitted. */
  params: Partial<Record<(typeof UTM_KEYS)[number] | (typeof CLICK_ID_KEYS)[number], string>>;
  /** Derived when no utm_source: "google" for gclid/gbraid/wbraid, "facebook" for fbclid, referrer host, or "(direct)". */
  source: string;
  /** Derived when no utm_medium: "cpc" for click ids, "referral", "organic" for known search engines, or "(none)". */
  medium: string;
  landingPage: string; // full URL incl. query
  referrer: string;
  at: string; // ISO timestamp
}

/**
 * Stored in ATTRIBUTION_COOKIE (JSON, base64url) on COOKIE_DOMAIN and mirrored to localStorage.
 * first: set once, never overwritten while the cookie lives.
 * last:  replaced whenever a landing carries a utm or click id. A plain direct or internal
 *        visit does NOT replace last (last non-direct click).
 */
export interface AttributionState {
  first: Touch;
  last: Touch;
  /** Number of sessions seen (new session = 30 minutes idle). */
  sessions: number;
}

/** Browser identifiers attached to every lead so the server and the CRM can match ad clicks. */
export interface BrowserIds {
  fbp: string; // _fbp cookie
  fbc: string; // _fbc cookie, or built as fb.1.<ms>.<fbclid> from the latest fbclid
  gaClientId: string; // from _ga: the "XXXXXXXXXX.YYYYYYYYYY" part
  gaSessionId: string; // from _ga_W5R65NR85B
  userAgent: string;
  pageUrl: string;
  pageTitle: string;
}

/** Every form that creates a lead. `form_id` in analytics, `leadSource` in the CRM. */
export type LeadFormId =
  | "contact" // src/pages/contact.astro
  | "plan_dialog" // src/components/studio/PlanDialog.astro (Service Studio shortlist)
  | "industry" // src/components/industry/IndustryLeadForm.astro
  | "bfcm_claim" // src/pages/black-friday.astro
  | "ad_grader" // src/pages/ad-account-grader.astro
  | "growth_system"; // src/pages/growth-system/qualify.astro via src/funnel/crm/submit.ts

/** Contact fields. Plain text in the request to /api/lead (HTTPS); hashed only for Meta and Google. */
export interface LeadContact {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string; // as typed; server normalizes to E.164 (default country US)
  company?: string;
  website?: string;
  zip?: string;
}

/** What submitLead() sends to POST /api/lead. */
export interface LeadRequest {
  eventId: string; // crypto.randomUUID(); shared by pixel, CAPI, dataLayer, and CRM
  formId: LeadFormId;
  /** The CRM lead source. Defaults to formId; promo forms use the promo id (for example "bfcm-2026"). */
  leadSource: string;
  contact: LeadContact;
  /** Everything else the form collected, flat string values: message, businessType, industry,
   *  qualifier, interestedServices (comma-joined), promoId, promoName, grade, smsConsent, and so on. */
  fields: Record<string, string>;
  attribution: AttributionState;
  ids: BrowserIds;
  /** Consent snapshot at submit time. */
  consent: { ads: boolean; analytics: boolean };
  /** Honeypot value; must be empty. */
  hp: string;
  /** ms between first interaction with the form and submit; server rejects < 2500 as bot. */
  elapsedMs: number;
  /** false = CRM only: no browser generate_lead / Meta Lead and no server CAPI. Omitted means true. */
  conversion?: boolean;
}

export interface LeadResponse {
  ok: boolean;
  /** "sent" in production; "dry-run" when nothing was forwarded. */
  mode: "sent" | "dry-run";
  error?: string;
}

/**
 * The flat JSON the server forwards to GHL / n8n. Flat on purpose: GHL inbound webhooks map flat keys.
 * Every key always present (empty string when unknown) so GHL field mapping never shifts.
 */
export const CRM_KEYS = [
  "event_id", "form_id", "lead_source", "submitted_at",
  "first_name", "last_name", "full_name", "email", "phone", "company", "website", "zip",
  "message", "business_type", "industry", "qualifier", "interested_services", "promo_id", "promo_name",
  "sms_consent",
  "first_source", "first_medium", "first_campaign", "first_content", "first_term", "first_landing_page", "first_referrer", "first_touch_at",
  "last_source", "last_medium", "last_campaign", "last_content", "last_term", "last_landing_page", "last_referrer", "last_touch_at",
  "gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid",
  "fbp", "fbc", "ga_client_id", "ga_session_id",
  "page_url", "user_agent", "ip_address", "sessions",
  "extra_json", // JSON string of any `fields` not mapped above, so nothing a form collects is lost
] as const;

/**
 * dataLayer events. GA4 recommended names where one exists. GTM triggers on these exact names.
 * Every event also carries: page_type ("home" | "industry" | "service" | "promo" | "funnel" | "tool" | "other").
 */
export const EVENTS = {
  /** Every successful lead. Google Ads primary conversion "Lead - form". Meta: Lead (browser + CAPI). */
  generate_lead: ["event_id", "form_id", "lead_source", "value", "currency", "industry", "business_type", "interested_services", "promo_id"],
  /** Booked call (GHL calendar). Google Ads primary conversion "Booked call". Meta: Schedule. */
  book_appointment: ["event_id", "value", "currency", "booking_source"],
  /** Growth System qualifier answered and qualified. GA4 key event; Meta: SubmitApplication. */
  qualify_lead: ["event_id", "qualification", "score"],
  /** tel: link click. Google Ads secondary. Meta: Contact. */
  click_to_call: ["link_url", "placement"],
  /** mailto: link click. GA4 only. */
  click_email: ["link_url", "placement"],
  /** First interaction with any lead form. GA4 only (funnel step). */
  form_start: ["form_id"],
  /** Client-side validation failed on submit. GA4 only. */
  form_error: ["form_id", "error_field"],
  /** Service added to the shortlist. GA4 add_to_wishlist semantics. Meta: AddToWishlist. */
  add_to_shortlist: ["service_id", "service_count", "source"],
  /** Plan dialog opened. GA4; Meta: InitiateCheckout (the closest "started the conversion" signal). */
  begin_plan: ["service_count", "source"],
  /** Industry play or service card opened. GA4 only. Meta: ViewContent. */
  view_item: ["item_id", "item_category"],
  /** Promo surfaces. GA4 recommended ecommerce promotion events. */
  view_promotion: ["promotion_id", "creative_slot"],
  select_promotion: ["promotion_id", "creative_slot"],
  /** Ad Account Grader. GA4 only. */
  grader_start: [],
  grader_complete: ["grade"],
  /** Primary CTA button clicks (anything with data-track-cta). GA4 only. */
  cta_click: ["cta_id", "cta_text", "placement"],
} as const;

export type TrackEvent = keyof typeof EVENTS;

/** Meta standard event for each tracked event. Unlisted events are not sent to Meta. */
export const META_EVENT: Partial<Record<TrackEvent, string>> = {
  generate_lead: "Lead",
  book_appointment: "Schedule",
  qualify_lead: "SubmitApplication",
  click_to_call: "Contact",
  add_to_shortlist: "AddToWishlist",
  begin_plan: "InitiateCheckout",
  view_item: "ViewContent",
};

/**
 * Conversion values in USD, sent with generate_lead and book_appointment so Google and Meta bidding
 * can weigh them. Placeholders: Brent sets the real numbers (expected value of a lead from each form).
 */
export const LEAD_VALUES: Record<LeadFormId | "book_appointment", number> = {
  contact: 50,
  plan_dialog: 75,
  industry: 75,
  bfcm_claim: 75,
  ad_grader: 40,
  growth_system: 100,
  book_appointment: 200,
};

/**
 * Enhanced conversions: generate_lead also pushes user_data in the shape GTM's
 * "User-Provided Data" variable reads (Data Layer > user_data):
 *   { email, phone_number (E.164), address: { first_name, last_name, postal_code, country: "US" } }
 * The push is cleared afterwards with { user_data: undefined } so it does not leak into later events.
 */
