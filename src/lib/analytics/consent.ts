export const CONSENT_STORAGE_KEY = "maaxgen_consent_v1";

export const GTM_CONTAINER_ID = "GTM-MF279RR2";
export const META_PIXEL_ID = "1528990838912009";
export const GA4_MEASUREMENT_ID = "G-W5R65NR85B";

export type ConsentPreferences = {
  version: 1;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
};

export const DEFAULT_CONSENT: Omit<ConsentPreferences, "updatedAt"> = {
  version: 1,
  analytics: false,
  advertising: false,
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    MaaxConsent?: {
      get: () => ConsentPreferences | null;
      hasChoice: () => boolean;
      acceptAll: () => ConsentPreferences;
      rejectAll: () => ConsentPreferences;
      save: (prefs: { analytics: boolean; advertising: boolean }) => ConsentPreferences;
      openPreferences: () => void;
    };
  }
}

export {};
