import type { Recommendability, SiteSignals } from "./types";

/**
 * Sample data used by `/ai-readiness-scanner?demo=1` so the results dashboard can be
 * previewed and QA'd without API keys. Results rendered from this are labelled as a sample.
 */
export const DEMO_SIGNALS: SiteSignals = {
  metaPixel: true,
  gtm: true,
  ga4: true,
  serverSideTagging: false,
  chatWidget: "",
  bookingTool: "",
  ecommercePlatform: "",
  shopPay: false,
  captcha: "reCAPTCHA",
  botChallenge: false,
  mobileFriendly: true,
  crawlable: true,
  performanceScore: 54,
  lcpSeconds: 4.1,
  schemaTypes: ["WebSite", "BreadcrumbList"],
  pricingVisible: false,
  callForQuote: true,
  phoneVisible: true,
  hoursVisible: false,
};

export function demoRecommendability(businessName: string, city: string): Recommendability {
  return {
    available: true,
    provider: "sample",
    summary: `${businessName} appears to be a locally owned service business. I could not determine its specific services, pricing, or service area from what I know.`,
    inferredService: "home services",
    query: `best home services company in ${city || "your city"}`,
    mentioned: false,
    competitors: ["Northside Comfort Pros", "Reliable Home Experts", "BlueLine Services"],
    confidence: "low",
  };
}
