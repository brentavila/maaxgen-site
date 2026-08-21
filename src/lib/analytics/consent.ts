export const COOKIE_NOTICE_KEY = "maaxgen_cookie_notice_v1";

export const GTM_CONTAINER_ID = "GTM-MF279RR2";
export const META_PIXEL_ID = "1528990838912009";
export const GA4_MEASUREMENT_ID = "G-W5R65NR85B";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    MaaxCookieNotice?: {
      isDismissed: () => boolean;
      dismiss: () => void;
      show: () => void;
    };
  }
}

export {};
