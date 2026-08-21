import { hasEventFired, markEventFired } from "./state";
import type { FunnelEventName } from "./types";

type EventParams = Record<string, string | number | boolean | undefined | null>;

function hasAnalyticsConsent(): boolean {
  return Boolean(window.MaaxConsent?.get()?.analytics);
}

function hasAdvertisingConsent(): boolean {
  return Boolean(window.MaaxConsent?.get()?.advertising);
}

function cleanParams(params?: EventParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!params) return out;
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    out[key] = value;
  }
  return out;
}

/**
 * Consent-aware funnel tracking.
 * - GA4 / Ads via GTM dataLayer
 * - Meta via trackCustom (and standard Lead where appropriate)
 * Dedupes once-per-session events when onceKey is provided.
 */
export function trackFunnelEvent(
  eventName: FunnelEventName | string,
  params?: EventParams,
  options?: { onceKey?: string; metaStandard?: string }
): void {
  const onceKey = options?.onceKey ?? eventName;
  if (onceKey && hasEventFired(onceKey)) return;
  if (onceKey) markEventFired(onceKey);

  const payload = {
    ...cleanParams(params),
    funnel: "growth-system",
  };

  if (hasAnalyticsConsent()) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...payload });
  }

  if (hasAdvertisingConsent() && typeof window.fbq === "function") {
    if (options?.metaStandard) {
      window.fbq("track", options.metaStandard, payload);
    } else {
      window.fbq("trackCustom", eventName, payload);
    }
  }
}

/** Fire again after consent if the user accepts mid-session (page-level helpers use this). */
export function trackFunnelEventAllowRepeat(
  eventName: FunnelEventName | string,
  params?: EventParams
): void {
  const payload = {
    ...cleanParams(params),
    funnel: "growth-system",
  };

  if (hasAnalyticsConsent()) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...payload });
  }

  if (hasAdvertisingConsent() && typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, payload);
  }
}
