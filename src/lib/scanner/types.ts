export type CheckStatus = "pass" | "warn" | "fail" | "unknown";

export type PillarId = "recommendability" | "friction" | "signals";

export interface ScanInput {
  url: string;
  businessName: string;
  city: string;
  email: string;
  phone?: string;
}

/**
 * Raw facts about a site, gathered from any combination of sources
 * (PageSpeed Insights network requests, the optional scanner API's HTML pass).
 * `null` means "no source could tell us"; it is never treated as a failure.
 */
export interface SiteSignals {
  metaPixel: boolean | null;
  gtm: boolean | null;
  ga4: boolean | null;
  serverSideTagging: boolean | null;
  chatWidget: string | null;
  bookingTool: string | null;
  ecommercePlatform: string | null;
  shopPay: boolean | null;
  captcha: string | null;
  botChallenge: boolean | null;

  mobileFriendly: boolean | null;
  crawlable: boolean | null;
  performanceScore: number | null;
  lcpSeconds: number | null;

  schemaTypes: string[] | null;
  pricingVisible: boolean | null;
  callForQuote: boolean | null;
  phoneVisible: boolean | null;
  hoursVisible: boolean | null;
}

export interface Recommendability {
  available: boolean;
  /** What the model believes the business sells, in its own words. */
  summary?: string;
  /** The service category the model inferred, e.g. "med spa". */
  inferredService?: string;
  /** The query used for the competitor test, e.g. "best med spa in Austin". */
  query?: string;
  /** Whether the business appeared in the model's recommendations. */
  mentioned?: boolean;
  competitors?: string[];
  /** Model's self-reported familiarity with the business. */
  confidence?: "high" | "medium" | "low";
  provider?: string;
}

export interface Check {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  weight: number;
}

export interface PillarReport {
  id: PillarId;
  title: string;
  question: string;
  /** Points earned, scaled to `max`. Null when nothing could be measured. */
  score: number | null;
  max: number;
  checks: Check[];
}

export interface ScanReport {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  label: string;
  headline: string;
  summary: string;
  /** True when at least one pillar had no measurable checks. */
  provisional: boolean;
  measuredChecks: number;
  totalChecks: number;
  pillars: PillarReport[];
  nextMoves: string[];
  recommendability: Recommendability;
  sources: string[];
}

/** Response contract for the optional scanner API (see scripts/scanner-api.mjs). */
export interface ScannerApiResponse {
  ok: boolean;
  finalUrl?: string;
  /** Script/iframe/link URLs found in the page HTML. The client runs detection on these. */
  resourceUrls?: string[];
  html?: {
    title?: string;
    description?: string;
    schemaTypes?: string[];
    pricingVisible?: boolean;
    callForQuote?: boolean;
    phoneVisible?: boolean;
    hoursVisible?: boolean;
  };
  recommendability?: Recommendability;
  error?: string;
}
