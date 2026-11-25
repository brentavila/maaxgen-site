/**
 * SMS consent wording: the single source for every lead form.
 *
 * src/components/forms/SmsConsent.astro renders these strings, and each form sends the exact
 * same string with the lead as the consent record (smsMarketingConsentText /
 * smsTransactionalConsentText), so what a visitor read is what the CRM keeps.
 *
 * Rules for editing:
 * - Boxes stay optional and unchecked. Transactional and marketing consent stay separate boxes.
 * - Every box names MaaxGen, says what the texts are about, frequency, rates, HELP and STOP,
 *   and links the Privacy Policy and SMS Terms (SMS_LINK_SENTENCE is rendered as links).
 * - Marketing boxes also say consent is not a condition of purchase (required for prior express
 *   written consent) and that texts may be automated or AI-assisted. The request box covers
 *   non-marketing texts only, so it leaves those two sentences out. AI replies are disclosed in
 *   the SMS Terms and Privacy Policy, and the AI assistant should say it is AI in its first text.
 * - Bump SMS_CONSENT_VERSION whenever any wording changes, so each record shows what was shown.
 * - If the wording changes, update the A2P campaign's opt-in description to match.
 */

export const SMS_CONSENT_VERSION = "2026-11-25.2";

/** Rendered with links to /privacy/ and /terms/#sms. Keep the wording exact. */
export const SMS_LINK_SENTENCE = "See our Privacy Policy and SMS Terms.";

/** Every box. */
const BASE_DISCLOSURES =
  "Msg frequency varies. Msg & data rates may apply. Reply HELP for help or STOP to opt out.";

/** Marketing boxes only. */
const MARKETING_DISCLOSURES =
  `${BASE_DISCLOSURES} Texts may be automated or AI-assisted. Consent is not a condition of purchase.`;

export interface SmsConsentCopy {
  /** Bold first line of the box. Part of the consent record. */
  title: string;
  /** What the person agrees to. */
  body: string;
  /** Frequency, rates, HELP and STOP, plus the marketing-only sentences where they apply. */
  disclosures: string;
}

export const SMS_COPY = {
  transactional: {
    title: "Text me about my request",
    body: "I agree to get texts from MaaxGen about my request, like booking confirmations, reminders and replies.",
    disclosures: BASE_DISCLOSURES,
  },
  marketing: {
    title: "Text me offers",
    body: "I agree to get recurring marketing texts from MaaxGen at this number.",
    disclosures: MARKETING_DISCLOSURES,
  },
  /** The Black Friday claim form. Opting in is how the setup fee waiver is unlocked. */
  marketingBfcm: {
    title: "Waive my setup fee and text me offers",
    body:
      "I agree to get recurring marketing texts from MaaxGen at this number, including Black Friday offers. " +
      "Opting in waives my setup fee, even if I opt out later.",
    disclosures: MARKETING_DISCLOSURES,
  },
} satisfies Record<string, SmsConsentCopy>;

/** The full sentence set a box shows, as one plain string: the consent record. */
export function consentRecord(copy: SmsConsentCopy): string {
  return `${copy.title}. ${copy.body} ${copy.disclosures} ${SMS_LINK_SENTENCE}`;
}

export const SMS_TRANSACTIONAL_CONSENT = consentRecord(SMS_COPY.transactional);
export const SMS_MARKETING_CONSENT = consentRecord(SMS_COPY.marketing);
export const SMS_BFCM_MARKETING_CONSENT = consentRecord(SMS_COPY.marketingBfcm);
