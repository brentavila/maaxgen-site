/**
 * The only place that writes to dataLayer or calls fbq (contract.ts rules).
 * GTM reads the dataLayer events for GA4 and Google Ads; the Meta pixel gets the mapped standard event.
 */
import { EVENTS, META_EVENT, type TrackEvent } from "./contract";
import { getConsent } from "./consent";

export type PageType = "home" | "industry" | "service" | "promo" | "funnel" | "tool" | "other";
export type TrackParams = Record<string, string | number | boolean | undefined | null>;

type DataLayerEntry = Record<string, unknown>;
type Fbq = (...args: unknown[]) => void;

/** Page type from the path. */
export function pageType(pathname: string = location.pathname): PageType {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/") return "home";
  if (p === "/industries" || p.startsWith("/industries/")) return "industry";
  if (p === "/services" || p.startsWith("/services/") || p === "/pricing") return "service";
  if (p === "/black-friday" || p.startsWith("/black-friday/")) return "promo";
  if (p === "/growth-system" || p.startsWith("/growth-system/") || p === "/counseling") return "funnel";
  if (p === "/ad-account-grader" || p.startsWith("/ad-account-grader/")) return "tool";
  return "other";
}

export function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Low-level dataLayer push. Internal to src/lib/tracking; components use track() or submitLead(). */
export function pushDataLayer(entry: DataLayerEntry): void {
  try {
    const w = window as unknown as { dataLayer?: DataLayerEntry[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(entry);
  } catch {
    /* analytics never breaks the page */
  }
}

function clean(params: TrackParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    out[k] = v;
  }
  return out;
}

/**
 * Push `{event, page_type, ...params}` to the dataLayer and, when the event maps to a Meta standard
 * event and ads consent is granted, fire fbq("track", name, params, {eventID}).
 * eventID is params.event_id when given (so the server CAPI event dedupes), otherwise a new uuid.
 * Returns the event id used for Meta.
 */
export interface TrackOptions {
  /** GTM calls this once the event's tags have fired (or eventTimeout elapsed). Not called when GTM is absent. */
  eventCallback?: () => void;
  eventTimeout?: number;
}

export function track(event: TrackEvent, params: TrackParams = {}, options: TrackOptions = {}): string {
  // A fresh id per call unless the caller passed one (submitLead passes the id it sent to /api/lead).
  const eventId = typeof params.event_id === "string" && params.event_id ? params.event_id : newEventId();
  try {
    // GTM data layer variables (v2) keep their last value across events, so every key this event
    // declares in EVENTS is pushed, "" when not supplied, to stop stale values leaking in.
    const declared: Record<string, string | number | boolean> = {};
    for (const key of EVENTS[event] as readonly string[]) declared[key] = "";
    if ("event_id" in declared) declared.event_id = eventId;
    const gtmOpts: DataLayerEntry = {};
    if (options.eventCallback) {
      gtmOpts.eventCallback = options.eventCallback;
      gtmOpts.eventTimeout = options.eventTimeout ?? 1200;
    }
    pushDataLayer({ event, page_type: pageType(), ...declared, ...clean(params), ...gtmOpts });

    const metaName = META_EVENT[event];
    if (metaName && getConsent().ads) {
      const fbq = (window as unknown as { fbq?: Fbq }).fbq;
      if (typeof fbq === "function") {
        const { event_id: _omit, ...rest } = clean(params);
        const metaParams: Record<string, string | number | boolean> = { ...rest };
        if (event === "generate_lead" && metaParams.form_id && !metaParams.content_name) {
          metaParams.content_name = metaParams.form_id;
        }
        fbq("track", metaName, metaParams, { eventID: eventId });
      }
    }
  } catch {
    /* analytics never breaks the page */
  }
  return eventId;
}
