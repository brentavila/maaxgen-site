import type {
  Check,
  CheckStatus,
  PillarReport,
  Recommendability,
  ScanInput,
  ScanReport,
  SiteSignals,
} from "./types";

const BUSINESS_SCHEMA_TYPES = /LocalBusiness|Organization|Store|Product|Service|Offer|Restaurant|MedicalBusiness|Dentist|Physician|HomeAndConstructionBusiness|AutoRepair|LegalService|FinancialService|HealthAndBeautyBusiness|ProfessionalService|FoodEstablishment|LodgingBusiness|RealEstateAgent|SportsActivityLocation|Hospital|Pharmacy|Plumber|Electrician|RoofingContractor|HVACBusiness|MovingCompany|Attorney|Accounting|InsuranceAgency|TravelAgency|EntertainmentBusiness|ChildCare|PetStore|VeterinaryCare|BeautySalon|DaySpa|HairSalon|NailSalon|TattooParlor/i;

const PILLAR_MAX = { recommendability: 35, friction: 35, signals: 30 } as const;

const NEXT_MOVES: Record<string, string> = {
  aiRecommended:
    "Build the evidence AI engines look for: structured pricing, verified review velocity, and citations from authoritative local sources.",
  aiSummary:
    "Rewrite your homepage so a machine can state what you sell, where, and for whom in one sentence, and back it with Organization and Service schema.",
  businessSchema:
    "Add LocalBusiness or Organization schema markup with services, service area, hours, and pricing so AI agents can read your business like a data sheet.",
  mobileFriendly: "Fix mobile rendering first. Agents run headless mobile browsers and abandon pages that do not lay out cleanly.",
  speed: "Cut page load time. Slow pages make AI agents and ad algorithms both rank you lower.",
  crawlable: "Remove the noindex or robots rules that hide your pages. An AI cannot recommend what it is not allowed to read.",
  noBotBlock:
    "Replace blanket CAPTCHAs and bot challenges with targeted protection so shopping agents like Meta Muse and Instinct are not turned away at the door.",
  pricingLegible:
    "Publish structured pricing or starting-at ranges. 'Call for a quote' is where AI agents give up and buy from the competitor down the street.",
  bookingPath:
    "Install a bookable calendar or checkout an agent can complete without a phone call, and expose it in schema.",
  metaPixel: "Install the Meta Pixel and connect it to real conversion events so Advantage+ can learn who actually buys.",
  gtmOrGa: "Install Google Tag Manager and GA4 so every conversion is measured consistently across campaigns.",
  serverSide:
    "Move to server-side tracking (Conversions API and server-side GTM) so browser blockers stop eating your conversion data.",
  speedToLead:
    "Add instant SMS or AI-voice follow-up so every inquiry, human or agent, gets an answer in under a minute.",
};

function check(id: string, label: string, weight: number, status: CheckStatus, detail: string): Check {
  return { id, label, weight, status, detail };
}

function boolStatus(value: boolean | null, invert = false): CheckStatus {
  if (value === null) return "unknown";
  return (invert ? !value : value) ? "pass" : "fail";
}

export function buildRecommendabilityChecks(signals: SiteSignals, rec: Recommendability): Check[] {
  const checks: Check[] = [];

  if (rec.available) {
    const summaryKnown = Boolean(rec.summary) && rec.confidence !== "low";
    checks.push(
      check(
        "aiSummary",
        "AI can describe what you sell",
        10,
        rec.summary ? (summaryKnown ? "pass" : "warn") : "fail",
        rec.summary
          ? summaryKnown
            ? "The model gave a confident description of your business."
            : "The model could describe you, but with low confidence."
          : "The model could not say what your business sells.",
      ),
    );
    const mentioned = rec.mentioned === true;
    checks.push(
      check(
        "aiRecommended",
        rec.query ? `Recommended for "${rec.query}"` : "Recommended for your category",
        15,
        mentioned ? "pass" : "fail",
        mentioned
          ? "Your business appeared in the AI's recommendations."
          : rec.competitors?.length
            ? `AI recommended ${rec.competitors.slice(0, 2).join(" and ")} and skipped you.`
            : "AI did not include your business in its recommendations.",
      ),
    );
  } else {
    checks.push(
      check("aiSummary", "AI can describe what you sell", 10, "unknown", "Delivered in your full scorecard."),
      check("aiRecommended", "Recommended for your category", 15, "unknown", "Delivered in your full scorecard."),
    );
  }

  const types = signals.schemaTypes;
  const hasBusinessSchema = types === null ? null : types.some((type) => BUSINESS_SCHEMA_TYPES.test(type));
  checks.push(
    check(
      "businessSchema",
      "Machine-readable business data (schema)",
      10,
      boolStatus(hasBusinessSchema),
      hasBusinessSchema === null
        ? "Not measurable from the browser alone."
        : hasBusinessSchema
          ? `Found ${types!.filter((type) => BUSINESS_SCHEMA_TYPES.test(type)).slice(0, 3).join(", ")} schema.`
          : types && types.length
            ? `Only ${types.slice(0, 2).join(", ")} schema found; no business, service, or product entity.`
            : "No structured data found. AI agents are reading plain text and guessing.",
    ),
  );

  return checks;
}

export function buildFrictionChecks(signals: SiteSignals): Check[] {
  const checks: Check[] = [];

  checks.push(
    check(
      "mobileFriendly",
      "Renders cleanly in a mobile browser",
      6,
      boolStatus(signals.mobileFriendly),
      signals.mobileFriendly === null
        ? "Not measured."
        : signals.mobileFriendly
          ? "Viewport is configured for mobile and headless agents."
          : "No mobile viewport. Headless agents see a broken layout.",
    ),
  );

  const perf = signals.performanceScore;
  const speedStatus: CheckStatus = perf === null ? "unknown" : perf >= 70 ? "pass" : perf >= 40 ? "warn" : "fail";
  checks.push(
    check(
      "speed",
      "Loads fast enough for an agent to finish",
      6,
      speedStatus,
      perf === null
        ? "Not measured."
        : `Performance score ${perf}/100${signals.lcpSeconds ? `, largest content painted at ${signals.lcpSeconds}s` : ""}.`,
    ),
  );

  checks.push(
    check(
      "crawlable",
      "AI crawlers are allowed in",
      7,
      boolStatus(signals.crawlable),
      signals.crawlable === null
        ? "Not measured."
        : signals.crawlable
          ? "Pages are indexable and robots.txt is valid."
          : "Pages are blocked from indexing. AI cannot recommend what it cannot read.",
    ),
  );

  let botStatus: CheckStatus = "unknown";
  let botDetail = "Not measured.";
  if (signals.botChallenge !== null || signals.captcha !== null) {
    if (signals.botChallenge) {
      botStatus = "fail";
      botDetail = "A bot challenge page is in front of your site. Shopping agents get turned away before they see an offer.";
    } else if (signals.captcha) {
      botStatus = "warn";
      botDetail = `${signals.captcha} detected. Fine on forms, a dead end if it gates browsing or checkout.`;
    } else {
      botStatus = "pass";
      botDetail = "No blanket bot blockers or CAPTCHAs detected on the homepage.";
    }
  }
  checks.push(check("noBotBlock", "Not blocking shopping agents", 6, botStatus, botDetail));

  let pricingStatus: CheckStatus = "unknown";
  let pricingDetail = "Not measurable from the browser alone.";
  if (signals.pricingVisible !== null || signals.callForQuote !== null) {
    if (signals.pricingVisible) {
      pricingStatus = signals.callForQuote ? "warn" : "pass";
      pricingDetail = signals.callForQuote
        ? "Some prices are visible, but key services are still hidden behind 'call for a quote'."
        : "Prices are published where an agent can read them.";
    } else if (signals.callForQuote) {
      pricingStatus = "fail";
      pricingDetail = "Pricing is hidden behind 'call for a quote'. This is where Muse and Instinct abandon your site.";
    } else {
      pricingStatus = "fail";
      pricingDetail = "No visible pricing on the homepage. Agents cannot compare you, so they do not pick you.";
    }
  }
  checks.push(check("pricingLegible", "Pricing an agent can read", 5, pricingStatus, pricingDetail));

  const bookingKnown = signals.bookingTool !== null || signals.ecommercePlatform !== null || signals.shopPay !== null;
  const bookingPath = signals.bookingTool || signals.ecommercePlatform || (signals.shopPay ? "Shop Pay" : "");
  checks.push(
    check(
      "bookingPath",
      "A booking or checkout path an agent can complete",
      5,
      bookingKnown ? (bookingPath ? "pass" : "fail") : "unknown",
      !bookingKnown
        ? "Not measured."
        : bookingPath
          ? `${bookingPath} detected${signals.shopPay ? " with Shop Pay" : ""}.`
          : "No online booking or checkout detected. Every sale still needs a human on the phone.",
    ),
  );

  return checks;
}

export function buildSignalChecks(signals: SiteSignals): Check[] {
  const checks: Check[] = [];

  checks.push(
    check(
      "metaPixel",
      "Meta Pixel installed",
      8,
      boolStatus(signals.metaPixel),
      signals.metaPixel === null
        ? "Not measured."
        : signals.metaPixel
          ? "Meta Pixel is loading on the homepage."
          : "No Meta Pixel. Advantage+ has nothing to learn from.",
    ),
  );

  const gtmOrGa = signals.gtm === null && signals.ga4 === null ? null : Boolean(signals.gtm || signals.ga4);
  checks.push(
    check(
      "gtmOrGa",
      "Google Tag Manager or GA4",
      6,
      boolStatus(gtmOrGa),
      gtmOrGa === null
        ? "Not measured."
        : gtmOrGa
          ? `${[signals.gtm && "Tag Manager", signals.ga4 && "GA4"].filter(Boolean).join(" and ")} detected.`
          : "No Google tagging detected. Conversions are not being measured consistently.",
    ),
  );

  checks.push(
    check(
      "serverSide",
      "Server-side tracking (CAPI / sGTM)",
      8,
      boolStatus(signals.serverSideTagging),
      signals.serverSideTagging === null
        ? "Not measured."
        : signals.serverSideTagging
          ? "First-party tagging endpoint detected. Browser blockers are not eating your data."
          : "All tracking is browser-only. Ad blockers and iOS privacy settings are hiding a large share of your conversions.",
    ),
  );

  checks.push(
    check(
      "speedToLead",
      "Instant follow-up (chat, SMS, or AI voice)",
      8,
      signals.chatWidget === null ? "unknown" : signals.chatWidget ? "pass" : "fail",
      signals.chatWidget === null
        ? "Not measured."
        : signals.chatWidget
          ? `${signals.chatWidget} is answering visitors.`
          : "No instant-response widget detected. Leads wait, then go cold.",
    ),
  );

  return checks;
}

function scorePillar(checks: Check[], max: number): number | null {
  const known = checks.filter((item) => item.status !== "unknown");
  if (known.length === 0) return null;
  const possible = known.reduce((sum, item) => sum + item.weight, 0);
  const earned = known.reduce((sum, item) => {
    if (item.status === "pass") return sum + item.weight;
    if (item.status === "warn") return sum + item.weight / 2;
    return sum;
  }, 0);
  return Math.round((earned / possible) * max);
}

export function gradeFor(score: number): { grade: ScanReport["grade"]; label: string } {
  if (score >= 85) return { grade: "A", label: "AI-ready. Keep the lead." };
  if (score >= 70) return { grade: "B", label: "Visible, with a few gaps agents trip on" };
  if (score >= 50) return { grade: "C", label: "Findable by humans, unclear to machines" };
  if (score >= 30) return { grade: "D", label: "AI is routing around you" };
  return { grade: "F", label: "Invisible to AI, and leaking ad spend" };
}

function buildHeadline(input: ScanInput, pillars: PillarReport[], rec: Recommendability, signals: SiteSignals): { headline: string; summary: string } {
  const failed = new Set(
    pillars.flatMap((pillar) => pillar.checks.filter((item) => item.status === "fail").map((item) => item.id)),
  );

  if (rec.available && rec.mentioned && failed.size === 0) {
    return {
      headline: "AI already recommends you. Now protect the lead.",
      summary: `${input.businessName} showed up when we asked for "${rec.query}". The moves below keep you there as competitors catch up.`,
    };
  }
  if (rec.available && rec.mentioned === false && rec.competitors?.length) {
    return {
      headline: `AI is sending your customers to ${rec.competitors.slice(0, 2).join(" and ")}.`,
      summary: `When we asked for "${rec.query}", ${input.businessName} was not in the answer. The fixes below are how you get into it.`,
    };
  }
  if (rec.available && !rec.summary) {
    return {
      headline: "ChatGPT does not know what you sell.",
      summary: `The model could not describe ${input.businessName}. Until it can, it will not recommend you.`,
    };
  }
  if (failed.has("crawlable")) {
    return {
      headline: "AI is not allowed to read your site.",
      summary: "Your pages are blocked from indexing, so no engine can recommend you.",
    };
  }
  if (failed.has("noBotBlock")) {
    return {
      headline: "Shopping agents are being turned away at the door.",
      summary: "A bot challenge sits in front of your site. Muse and Instinct will buy from whoever lets them in.",
    };
  }
  if (failed.has("metaPixel") && failed.has("gtmOrGa")) {
    return {
      headline: "Your ads are running blind.",
      summary: "No conversion tracking is loading on your homepage. Meta and Google are guessing who to show your ads to.",
    };
  }
  if (failed.has("pricingLegible")) {
    return {
      headline: "Agents cannot find your price, so they cannot pick you.",
      summary: "Hidden pricing is the single most common reason an AI agent abandons a small business site.",
    };
  }
  if (failed.has("serverSide")) {
    return {
      headline: "Your tracking is browser-only. A big share of your conversions never reach Meta or Google.",
      summary: "Server-side signals are the data pipes that train the platforms' AI to find your best customers.",
    };
  }
  if (failed.has("speedToLead")) {
    return {
      headline: "Nobody answers in the first minute.",
      summary: "Every inquiry, human or agent, is waiting on a callback. The next business to respond wins it.",
    };
  }
  if (!rec.available && failed.size === 0 && signals.metaPixel) {
    return {
      headline: "Your foundations look solid. The AI recommendation test is the one that matters next.",
      summary: "We will run the live ChatGPT and Perplexity test in your full scorecard.",
    };
  }
  return {
    headline: "Good foundations, with specific gaps that AI agents notice.",
    summary: "The moves below are ordered by what will change your AI visibility and ad results fastest.",
  };
}

/** Failures that stop AI from reading the site at all outrank everything else. */
const BLOCKING_CHECKS = new Set(["crawlable", "noBotBlock"]);

function movePriority(item: Check): number {
  const statusFactor = item.status === "fail" ? 1 : 0.5;
  const blockingFactor = BLOCKING_CHECKS.has(item.id) && item.status === "fail" ? 2 : 1;
  return item.weight * statusFactor * blockingFactor;
}

export function buildNextMoves(pillars: PillarReport[]): string[] {
  const candidates = pillars
    .flatMap((pillar) => pillar.checks)
    .filter((item) => item.status === "fail" || item.status === "warn")
    .sort((a, b) => movePriority(b) - movePriority(a))
    .map((item) => NEXT_MOVES[item.id])
    .filter((text): text is string => Boolean(text));

  const unique = Array.from(new Set(candidates)).slice(0, 3);
  if (unique.length < 3) {
    const fallbacks = [
      NEXT_MOVES.aiRecommended,
      NEXT_MOVES.serverSide,
      NEXT_MOVES.speedToLead,
    ].filter((text) => !unique.includes(text));
    unique.push(...fallbacks.slice(0, 3 - unique.length));
  }
  return unique;
}

export function buildReport(
  input: ScanInput,
  signals: SiteSignals,
  recommendability: Recommendability,
  sources: string[],
): ScanReport {
  const pillars: PillarReport[] = [
    {
      id: "recommendability",
      title: "Recommendability",
      question: "Do AI platforms understand what you sell, and do they recommend you?",
      checks: buildRecommendabilityChecks(signals, recommendability),
      max: PILLAR_MAX.recommendability,
      score: null,
    },
    {
      id: "friction",
      title: "Agent friction",
      question: "Can an agent like Meta Muse or Instinct read your pricing and complete a booking?",
      checks: buildFrictionChecks(signals),
      max: PILLAR_MAX.friction,
      score: null,
    },
    {
      id: "signals",
      title: "Signal & tracking",
      question: "Are your ads feeding accurate conversion data back to Meta and Google?",
      checks: buildSignalChecks(signals),
      max: PILLAR_MAX.signals,
      score: null,
    },
  ];

  for (const pillar of pillars) pillar.score = scorePillar(pillar.checks, pillar.max);

  const measured = pillars.filter((pillar) => pillar.score !== null);
  const possible = measured.reduce((sum, pillar) => sum + pillar.max, 0);
  const earned = measured.reduce((sum, pillar) => sum + (pillar.score ?? 0), 0);
  const score = possible > 0 ? Math.round((earned / possible) * 100) : 0;
  const { grade, label } = gradeFor(score);
  const { headline, summary } = buildHeadline(input, pillars, recommendability, signals);

  const allChecks = pillars.flatMap((pillar) => pillar.checks);

  return {
    score,
    grade,
    label,
    headline,
    summary,
    provisional: measured.length < pillars.length,
    measuredChecks: allChecks.filter((item) => item.status !== "unknown").length,
    totalChecks: allChecks.length,
    pillars,
    nextMoves: buildNextMoves(pillars),
    recommendability,
    sources,
  };
}
