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

export const SMS_CONSENT_VERSION = "2026-11-21";

/** Rendered with links to /privacy/ and /terms/#sms. Keep the wording exact. */
export const SMS_LINK_SENTENCE = "See our Privacy Policy and SMS Terms.";

const DISCLOSURES =
  "Texts may be sent with automated technology, and some replies may be written by AI. " +
  "Consent is not a condition of purchase. Message frequency varies. Message & data rates may apply. " +
  "Reply HELP for help or STOP to opt out at any time.";

export interface SmsConsentCopy {
  /** Bold first line of the box. Part of the consent record. */
  title: string;
  /** What the person agrees to. */
  body: string;
}

export const SMS_COPY = {
  transactional: {
    title: "Text me about my request",
    body:
      "I agree to receive non-marketing text messages from MaaxGen at the number I provided about my " +
      "request, including booking confirmations, call reminders, replies to my inquiry, and account or service updates.",
  },
  marketing: {
    title: "Text me offers and updates",
    body:
      "I agree to receive recurring marketing text messages from MaaxGen at the number I provided about " +
      "special offers, discounts, and service updates.",
  },
  /** The Black Friday claim form. Opting in is how the setup fee waiver is unlocked. */
  marketingBfcm: {
    title: "Waive my setup fee and text me Black Friday offers",
    body:
      "I agree to receive recurring marketing text messages from MaaxGen at the number I provided, " +
      "including Black Friday and Cyber Monday offer reminders, special offers, and service updates. " +
      "Opting in is how the setup fee is waived on this offer, and the waiver stays even if I opt out later.",
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
