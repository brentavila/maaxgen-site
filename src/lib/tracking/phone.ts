/**
 * Phone normalization shared by the browser (enhanced conversions user_data) and the server
 * (CRM payload, Meta CAPI). Pure; no DOM or Node APIs.
 */

/**
 * Normalize a typed phone number to E.164, default country US.
 * Returns "" when the input cannot be read as a phone number.
 *   "(555) 123-4567"   -> "+15551234567"
 *   "1-555-123-4567"   -> "+15551234567"
 *   "+44 20 7946 0958" -> "+442079460958"
 */
export function normalizePhoneE164(input: string | undefined | null): string {
  if (!input) return "";
  const raw = String(input).trim();
  if (!raw) return "";
  // Drop an extension ("x123", "ext. 123") before reading digits.
  const main = raw.split(/\s*(?:ext\.?|x|#)\s*\d+\s*$/i)[0] ?? raw;
  const digits = main.replace(/\D/g, "");
  if (!digits) return "";

  if (main.startsWith("+")) {
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : "";
  }
  if (main.startsWith("00") && digits.length >= 10 && digits.length <= 17) {
    return `+${digits.slice(2)}`;
  }
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return "";
}
