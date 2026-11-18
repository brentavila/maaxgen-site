/**
 * Booking completion for the GoHighLevel (LeadConnector) calendar widget.
 *
 * The widget posts a message to its parent window when a booking is confirmed. Third-party
 * tracking guides (not official GHL docs) describe it as an ARRAY whose first item is
 * "msgsndr-booking-complete", for example ["msgsndr-booking-complete", <id>, "<json of inputs>"].
 * We also accept a string or an object carrying that name, in case the shape differs.
 * Only messages from GHL origins count (event.origin is verified).
 */
import { LEAD_VALUES, track } from "../lib/tracking";

const BOOKING_MESSAGE = "msgsndr-booking-complete";
const ORIGIN_RE = /(^|\.)(leadconnectorhq\.com|msgsndr\.com|gohighlevel\.com)$/i;
const DONE_KEY = "maaxgen-booking-tracked";

export function isGhlOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && ORIGIN_RE.test(url.hostname);
  } catch {
    return false;
  }
}

export function isBookingMessage(data: unknown): boolean {
  try {
    if (Array.isArray(data)) return data[0] === BOOKING_MESSAGE;
    if (typeof data === "string") return data.includes(BOOKING_MESSAGE);
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      return [d.type, d.event, d.action, d.name].some((v) => v === BOOKING_MESSAGE);
    }
  } catch {
    /* ignore */
  }
  return false;
}

/** Fire book_appointment once per browser session (a refresh or a second signal does not double count). */
export function trackBookingOnce(): void {
  try {
    if (sessionStorage.getItem(DONE_KEY)) return;
    sessionStorage.setItem(DONE_KEY, "1");
  } catch {
    /* storage blocked: fire anyway */
  }
  track("book_appointment", {
    value: LEAD_VALUES.book_appointment,
    currency: "USD",
    booking_source: "growth_system",
  });
}

/** Listen for the widget's booking-complete message. Safe to call once per page. */
export function listenForBooking(): void {
  window.addEventListener("message", (event) => {
    if (!isGhlOrigin(event.origin)) return;
    if (isBookingMessage(event.data)) trackBookingOnce();
  });
}
