import type {
  CalendarProvider,
  FunnelVariantId,
  OfferBlock,
  VariantCopy,
  VideoProvider,
} from "./types";

/** Active A/B variant — flip to "b" or drive via ?v= later */
export const ACTIVE_VARIANT: FunnelVariantId = "a";

export const FUNNEL_BASE_PATH = "/growth-system";

export const FUNNEL_ROUTES = {
  vsl: FUNNEL_BASE_PATH,
  qualify: `${FUNNEL_BASE_PATH}/qualify`,
  results: `${FUNNEL_BASE_PATH}/results`,
  book: `${FUNNEL_BASE_PATH}/book`,
} as const;

/** Placeholder thresholds — edit freely for testing */
export const SCORE_THRESHOLDS = {
  highlyQualifiedMin: 50,
  potentiallyQualifiedMin: 25,
} as const;

export const VIDEO_CONFIG: {
  provider: VideoProvider;
  /** YouTube/Vimeo/Loom id OR full direct URL */
  src: string;
  title: string;
  poster?: string;
} = {
  provider: "youtube",
  src: "", // set PUBLIC_VSL_VIDEO_ID or edit here
  title: "Customer acquisition system overview",
};

export const CALENDAR_CONFIG: {
  provider: CalendarProvider;
  embedUrl: string;
  title: string;
} = {
  provider: "ghl",
  embedUrl: "", // set PUBLIC_VSL_CALENDAR_EMBED_URL
  title: "Book a strategy conversation",
};

const offerPilot: OfferBlock = {
  id: "pilot",
  eyebrow: "How engagement works",
  title: "Start with a focused pilot, then scale what works.",
  body: "We begin by mapping your current acquisition path, identifying the highest-leverage gaps, and building the connected pieces that turn advertising into qualified opportunities. Specific terms are discussed only when there is a clear fit.",
};

const offerStandard: OfferBlock = {
  id: "standard",
  eyebrow: "Engagement model",
  title: "A structured monthly partnership built around the full acquisition system.",
  body: "Strategy, advertising, conversion paths, follow-up infrastructure, and measurement stay under one accountable process. Pricing and scope are confirmed after we understand your economics and capacity.",
};

export const VARIANTS: Record<FunnelVariantId, VariantCopy> = {
  a: {
    eyebrow: "For service business owners",
    headline:
      "Build A Customer Acquisition System That Turns Advertising Into Qualified Opportunities",
    subheadline:
      "We help service businesses connect advertising, landing pages, follow-up, CRM automation, and conversion tracking into one system designed to consistently generate and convert opportunities.",
    primaryCta: "See If Your Business Qualifies",
    primaryCtaMicro: "Takes approximately 2 minutes.",
    finalCta: "See If Your Business Qualifies",
    offer: offerPilot,
  },
  b: {
    eyebrow: "For service business owners",
    headline: "Stop Buying Clicks. Start Building A System That Produces Customers.",
    subheadline:
      "MaaxGen helps established service businesses connect paid traffic, conversion, follow-up, and revenue tracking so advertising decisions are based on real outcomes—not guesswork.",
    primaryCta: "Check My Fit",
    primaryCtaMicro: "A short questionnaire. No sales call required to start.",
    finalCta: "Check My Fit",
    offer: offerStandard,
  },
};

export function getVariant(id: FunnelVariantId = ACTIVE_VARIANT): VariantCopy {
  return VARIANTS[id] ?? VARIANTS.a;
}

export function getPublicEnv(name: string): string {
  const env = import.meta.env as Record<string, string | undefined>;
  return (env[name] ?? "").trim();
}

export function resolveVideoSrc(): string {
  return getPublicEnv("PUBLIC_VSL_VIDEO_ID") || getPublicEnv("PUBLIC_VSL_VIDEO_URL") || VIDEO_CONFIG.src;
}

export function resolveCalendarEmbedUrl(): string {
  return getPublicEnv("PUBLIC_VSL_CALENDAR_EMBED_URL") || CALENDAR_CONFIG.embedUrl;
}

export function resolveWebhookUrl(): string {
  return getPublicEnv("PUBLIC_VSL_GHL_WEBHOOK_URL") || getPublicEnv("PUBLIC_GHL_WEBHOOK_URL") || "";
}
