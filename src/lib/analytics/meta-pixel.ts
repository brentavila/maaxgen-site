export const META_PIXEL_ID = "1528990838912009";

export const META_VIEW_CONTENT_PAGES: Record<string, string> = {
  "/pricing": "Pricing",
  "/services": "Services",
  "/case-studies": "Case Studies",
  "/about": "About",
};

declare global {
  interface Window {
    fbq?: (
      command: "track" | "init" | "trackCustom",
      eventName: string,
      params?: Record<string, string | number | boolean>
    ) => void;
  }
}

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window.fbq !== "function") return;
  window.fbq("track", eventName, params);
}
