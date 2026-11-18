/**
 * SMS consent language, identical to src/pages/contact.astro (which keeps its own
 * copy). If the contact page wording changes, change it here too: the strings are
 * sent with every lead that ticks a box, as the record of what was agreed to.
 */
export const SMS_MARKETING_CONSENT =
  "I consent to receive marketing text messages, about special offers, discounts, and service updates, from MaaxGen at the phone number provided. Message frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.";

export const SMS_TRANSACTIONAL_CONSENT =
  "I consent to receive non-marketing text messages from MaaxGen about appointment and booking confirmations, replies to my inquiry, and account or service updates. Message frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.";
