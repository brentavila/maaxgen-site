/**
 * Tracking-side consent.
 *
 * The site's ConsentBanner is a US-first disclosure notice ("Got it"), with no opt-in or opt-out
 * choice; it only stores maaxgen_cookie_notice_v1 = "1" when dismissed. There is nothing to deny,
 * so consent is treated as granted for ads and analytics.
 *
 * If a real consent manager is added later, it can expose window.MaaxConsent.get() returning
 * { analytics, advertising } (the shape src/funnel/track.ts already expects); getConsent() honors it.
 * Google-side consent for EEA/UK/CH visitors is handled separately by the Consent Mode v2 default
 * in ConsentManager.astro.
 */

export interface TrackingConsent {
  ads: boolean;
  analytics: boolean;
}

interface MaaxConsentApi {
  get?: () => { analytics?: boolean; advertising?: boolean; ads?: boolean } | null | undefined;
}

export function getConsent(): TrackingConsent {
  try {
    const api = (window as unknown as { MaaxConsent?: MaaxConsentApi }).MaaxConsent;
    const state = api?.get?.();
    if (state && typeof state === "object") {
      return {
        ads: Boolean(state.advertising ?? state.ads),
        analytics: Boolean(state.analytics),
      };
    }
  } catch {
    /* fall through */
  }
  return { ads: true, analytics: true };
}
