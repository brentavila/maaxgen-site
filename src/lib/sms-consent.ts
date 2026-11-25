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
 *   that texts can be automated or written with AI, that consent is not a condition of
 *   purchase, and links the Privacy Policy and SMS Terms (SMS_LINK_SENTENCE is rendered as links).
 * - Bump SMS_CONSENT_VERSION whenever any wording changes, so each record shows what was shown.
 * - If the wording changes, update the A2P campaign's opt-in description to match.
 */

export const SMS_CONSENT_VERSION = "2026-11-25";

/** Rendered with links to /privacy/ and /terms/#sms. Keep the wording exact. */
export const SMS_LINK_SENTENCE = "See our Privacy Policy and SMS Terms.";

const DISCLOSURES =
  "Msg frequency varies. Msg & data rates may apply. Reply HELP for help or STOP to opt out. " +
  "Texts may be automated or AI-assisted. Consent is not a condition of purchase.";

export interface SmsConsentCopy {
  /** Bold first line of the box. Part of the consent record. */
  title: string;
  /** What the person agrees to. */
  body: string;
}

export const SMS_COPY = {
  transactional: {
    title: "Text me about my request",
    body: "I agree to get texts from MaaxGen about my request, like booking confirmations, reminders and replies.",
  },
  marketing: {
    title: "Text me offers",
    body: "I agree to get recurring marketing texts from MaaxGen at this number.",
  },
  /** The Black Friday claim form. Opting in is how the setup fee waiver is unlocked. */
  marketingBfcm: {
    title: "Waive my setup fee and text me offers",
    body:
      "I agree to get recurring marketing texts from MaaxGen at this number, including Black Friday offers. " +
      "Opting in waives my setup fee, even if I opt out later.",
  },
} satisfies Record<string, SmsConsentCopy>;

export const SMS_DISCLOSURES = DISCLOSURES;

/** The full sentence set a box shows, as one plain string: the consent record. */
export function consentRecord(copy: SmsConsentCopy): string {
  return `${copy.title}. ${copy.body} ${DISCLOSURES} ${SMS_LINK_SENTENCE}`;
}

export const SMS_TRANSACTIONAL_CONSENT = consentRecord(SMS_COPY.transactional);
export const SMS_MARKETING_CONSENT = consentRecord(SMS_COPY.marketing);
export const SMS_BFCM_MARKETING_CONSENT = consentRecord(SMS_COPY.marketingBfcm);
