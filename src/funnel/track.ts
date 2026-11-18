import { track } from "../lib/tracking";
import { hasEventFired, markEventFired } from "./state";
import { trackBookingOnce } from "./booking";
import type { FunnelEventName } from "./types";

type EventParams = Record<string, string | number | boolean | undefined | null>;

/**
 * Funnel analytics now run through src/lib/tracking (consent, dataLayer, and Meta live there).
 * Funnel events map onto the tracking contract; the rest are intentionally not sent:
 *   qualification_started                       -> form_start { form_id: "growth_system" }
 *   lead_highly_qualified / _potentially_...    -> qualify_lead { qualification, score }
 *   appointment_booked                          -> book_appointment (see ./booking.ts)
 * Dropped (no contract event): vsl_*, qualification_step_completed, qualification_completed,
 * lead_not_qualified, calendar_viewed, calendar_booking_started, nq_resource_requested.
 * Once-per-session dedupe uses the funnel state (onceKey).
 */
export function trackFunnelEvent(
  eventName: FunnelEventName | string,
  params?: EventParams,
  options?: { onceKey?: string; metaStandard?: string }
): void {
  const onceKey = options?.onceKey ?? eventName;
  try {
    switch (eventName) {
      case "qualification_started":
        if (onceKey && hasEventFired(onceKey)) return;
        if (onceKey) markEventFired(onceKey);
        track("form_start", { form_id: "growth_system" });
        return;
      case "lead_highly_qualified":
      case "lead_potentially_qualified":
        if (onceKey && hasEventFired(onceKey)) return;
        if (onceKey) markEventFired(onceKey);
        track("qualify_lead", {
          qualification: String(params?.qualification_status ?? ""),
          score: typeof params?.lead_score === "number" ? params.lead_score : undefined,
        });
        return;
      case "appointment_booked":
        trackBookingOnce();
        return;
      default:
        return;
    }
  } catch {
    /* analytics never breaks the page */
  }
}
