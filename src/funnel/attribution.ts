import type { AttributionData } from "./types";

export const ATTRIBUTION_STORAGE_KEY = "maaxgen_funnel_attribution_v1";

const QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;

function emptyAttribution(): AttributionData {
  return {
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
    gclid: "",
    gbraid: "",
    wbraid: "",
    fbclid: "",
    landingPage: "",
    referrer: "",
    capturedAt: "",
  };
}

function fromQuery(params: URLSearchParams): Partial<AttributionData> {
  return {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || "",
    gclid: params.get("gclid") || "",
    gbraid: params.get("gbraid") || "",
    wbraid: params.get("wbraid") || "",
    fbclid: params.get("fbclid") || "",
  };
}

function hasAttributionSignal(data: Partial<AttributionData>): boolean {
  return QUERY_KEYS.some((key) => {
    const camel =
      key === "utm_source"
        ? "utmSource"
        : key === "utm_medium"
          ? "utmMedium"
          : key === "utm_campaign"
            ? "utmCampaign"
            : key === "utm_content"
              ? "utmContent"
              : key === "utm_term"
                ? "utmTerm"
                : key;
    return Boolean((data as Record<string, string>)[camel]);
  });
}

export function readAttribution(): AttributionData | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AttributionData;
  } catch {
    return null;
  }
}

export function writeAttribution(data: AttributionData): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Capture UTMs and click IDs on first funnel landing.
 * First non-empty capture wins so mid-funnel navigations don't overwrite.
 */
export function captureAttributionFromLocation(
  location: Location = window.location,
  referrer: string = document.referrer
): AttributionData {
  const existing = readAttribution();
  const fromUrl = fromQuery(new URLSearchParams(location.search));
  const hasNew = hasAttributionSignal(fromUrl);

  if (existing && !hasNew) return existing;

  if (existing && hasNew) {
    const merged: AttributionData = {
      ...existing,
      utmSource: fromUrl.utmSource || existing.utmSource,
      utmMedium: fromUrl.utmMedium || existing.utmMedium,
      utmCampaign: fromUrl.utmCampaign || existing.utmCampaign,
      utmContent: fromUrl.utmContent || existing.utmContent,
      utmTerm: fromUrl.utmTerm || existing.utmTerm,
      gclid: fromUrl.gclid || existing.gclid,
      gbraid: fromUrl.gbraid || existing.gbraid,
      wbraid: fromUrl.wbraid || existing.wbraid,
      fbclid: fromUrl.fbclid || existing.fbclid,
    };
    writeAttribution(merged);
    return merged;
  }

  const created: AttributionData = {
    ...emptyAttribution(),
    ...fromUrl,
    landingPage: `${location.pathname}${location.search}`,
    referrer: referrer || "",
    capturedAt: new Date().toISOString(),
  };
  writeAttribution(created);
  return created;
}
