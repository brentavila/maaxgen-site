import type { SiteSignals } from "./types";

interface NamedPattern {
  name: string;
  test: RegExp;
}

const CHAT_WIDGETS: NamedPattern[] = [
  { name: "Intercom", test: /widget\.intercom\.io|intercomcdn\.com/i },
  { name: "Drift", test: /js\.driftt\.com|drift\.com\/js/i },
  { name: "Tidio", test: /code\.tidio\.co/i },
  { name: "Crisp", test: /client\.crisp\.chat/i },
  { name: "Tawk.to", test: /embed\.tawk\.to/i },
  { name: "Podium", test: /connect\.podium\.com|podium\.com\/widget/i },
  { name: "Birdeye", test: /birdeye\.com/i },
  { name: "HubSpot Chat", test: /js\.hs-scripts\.com|js\.usemessages\.com/i },
  { name: "Zendesk", test: /static\.zdassets\.com|zopim\.com/i },
  { name: "LiveChat", test: /cdn\.livechatinc\.com/i },
  { name: "Olark", test: /static\.olark\.com/i },
  { name: "Freshchat", test: /wchat\.freshchat\.com/i },
  { name: "Gorgias", test: /config\.gorgias\.chat|gorgias\.chat/i },
  { name: "Chatbase", test: /chatbase\.co\/embed/i },
  { name: "Voiceflow", test: /cdn\.voiceflow\.com/i },
  { name: "Smith.ai", test: /smith\.ai/i },
  { name: "LeadConnector Chat", test: /widgets\.leadconnectorhq\.com|msgsndr\.com\/js/i },
  { name: "ManyChat", test: /widget\.manychat\.com/i },
  { name: "Text Request", test: /textrequest\.com/i },
  { name: "Facebook Customer Chat", test: /facebook\.com\/.*customerchat|xfbml\.customerchat/i },
];

const BOOKING_TOOLS: NamedPattern[] = [
  { name: "Calendly", test: /calendly\.com/i },
  { name: "Acuity Scheduling", test: /acuityscheduling\.com/i },
  { name: "Square Appointments", test: /squareup\.com\/appointments|square\.site/i },
  { name: "Mindbody", test: /mindbodyonline\.com|brandedweb\.mindbodyonline/i },
  { name: "Vagaro", test: /vagaro\.com/i },
  { name: "Booksy", test: /booksy\.com/i },
  { name: "Housecall Pro", test: /housecallpro\.com/i },
  { name: "ServiceTitan", test: /servicetitan\.com/i },
  { name: "Jobber", test: /getjobber\.com|clienthub\.app/i },
  { name: "Zenoti", test: /zenoti\.com/i },
  { name: "Boulevard", test: /joinblvd\.com|blvd\.co/i },
  { name: "OpenTable", test: /opentable\.com/i },
  { name: "Resy", test: /resy\.com/i },
  { name: "Toast", test: /toasttab\.com/i },
  { name: "Setmore", test: /setmore\.com/i },
  { name: "SimplyBook", test: /simplybook\.me/i },
  { name: "Schedulicity", test: /schedulicity\.com/i },
  { name: "Jane", test: /janeapp\.com/i },
  { name: "Zocdoc", test: /zocdoc\.com/i },
  { name: "LeadConnector Booking", test: /api\.leadconnectorhq\.com\/widget\/booking|link\.msgsndr\.com/i },
  { name: "HubSpot Meetings", test: /meetings\.hubspot\.com/i },
];

const ECOMMERCE_PLATFORMS: NamedPattern[] = [
  { name: "Shopify", test: /cdn\.shopify\.com|shopifycloud\.com|myshopify\.com/i },
  { name: "WooCommerce", test: /woocommerce|\/wc-|wc-blocks/i },
  { name: "BigCommerce", test: /bigcommerce\.com/i },
  { name: "Squarespace Commerce", test: /squarespace\.com\/commerce|static1\.squarespace\.com.*commerce/i },
  { name: "Wix Stores", test: /wixstatic\.com.*stores|ecom\.wix/i },
];

const CAPTCHA_PROVIDERS: NamedPattern[] = [
  { name: "reCAPTCHA", test: /google\.com\/recaptcha|gstatic\.com\/recaptcha|recaptcha\.net/i },
  { name: "hCaptcha", test: /hcaptcha\.com/i },
  { name: "Cloudflare Turnstile", test: /challenges\.cloudflare\.com\/turnstile/i },
];

const META_PIXEL = /connect\.facebook\.net\/[^/]+\/fbevents\.js|facebook\.com\/tr[/?]/i;
const GTM = /googletagmanager\.com\/gtm\.js/i;
const GA4 = /googletagmanager\.com\/gtag\/js|google-analytics\.com\/g\/collect|analytics\.google\.com\/g\/collect/i;
const SHOP_PAY = /shop\.app|shopifycloud\.com\/shop-js|shop_pay|pay\.shopify\.com/i;
const BOT_CHALLENGE = /\/cdn-cgi\/challenge-platform|\/cdn-cgi\/bm\//i;

const GOOGLE_HOSTS = /(^|\.)(googletagmanager\.com|google-analytics\.com|analytics\.google\.com|googleapis\.com|gstatic\.com|google\.com)$/i;

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

/** Returns the matched tool name, or "" when the URL list definitely contains none. */
function firstMatch(urls: string[], patterns: NamedPattern[]): string {
  for (const pattern of patterns) {
    if (urls.some((url) => pattern.test.test(url))) return pattern.name;
  }
  return "";
}

/**
 * Server-side tagging is visible when GTM/GA endpoints are served from a first-party
 * or dedicated tagging host instead of Google's own domains.
 */
export function detectServerSideTagging(urls: string[]): boolean {
  return urls.some((url) => {
    const host = hostnameOf(url);
    if (!host) return false;
    if (/stape\.io$/i.test(host) || /(^|\.)sgtm\./i.test(host) || /^gtm\./i.test(host)) return true;
    if (GOOGLE_HOSTS.test(host)) return false;
    return /\/gtm\.js\?id=GTM-|\/gtag\/js\?id=|\/g\/collect/i.test(url);
  });
}

export function emptySignals(): SiteSignals {
  return {
    metaPixel: null,
    gtm: null,
    ga4: null,
    serverSideTagging: null,
    chatWidget: null,
    bookingTool: null,
    ecommercePlatform: null,
    shopPay: null,
    captcha: null,
    botChallenge: null,
    mobileFriendly: null,
    crawlable: null,
    performanceScore: null,
    lcpSeconds: null,
    schemaTypes: null,
    pricingVisible: null,
    callForQuote: null,
    phoneVisible: null,
    hoursVisible: null,
  };
}

/**
 * Derive tracking, follow-up, booking, and bot-blocking signals from the list of
 * resource URLs a page loads. Every value becomes definite (true/false or name/"")
 * because the URL list is a complete observation of what the page requested.
 */
export function detectFromResourceUrls(urls: string[]): Partial<SiteSignals> {
  const clean = urls.filter((url) => typeof url === "string" && url.length > 0);
  return {
    metaPixel: clean.some((url) => META_PIXEL.test(url)),
    gtm: clean.some((url) => GTM.test(url)),
    ga4: clean.some((url) => GA4.test(url)),
    serverSideTagging: detectServerSideTagging(clean),
    chatWidget: firstMatch(clean, CHAT_WIDGETS),
    bookingTool: firstMatch(clean, BOOKING_TOOLS),
    ecommercePlatform: firstMatch(clean, ECOMMERCE_PLATFORMS),
    shopPay: clean.some((url) => SHOP_PAY.test(url)),
    captcha: firstMatch(clean, CAPTCHA_PROVIDERS),
    botChallenge: clean.some((url) => BOT_CHALLENGE.test(url)),
  };
}

/** Minimal shape of the PageSpeed Insights v5 response we rely on. */
export interface PsiLike {
  lighthouseResult?: {
    finalUrl?: string;
    categories?: Record<string, { score?: number | null }>;
    audits?: Record<
      string,
      {
        score?: number | null;
        numericValue?: number;
        details?: { items?: Array<Record<string, unknown>> };
      }
    >;
  };
}

export function resourceUrlsFromPsi(psi: PsiLike): string[] {
  const items = psi.lighthouseResult?.audits?.["network-requests"]?.details?.items ?? [];
  return items
    .map((item) => (typeof item.url === "string" ? item.url : ""))
    .filter((url) => url.length > 0);
}

export function signalsFromPsi(psi: PsiLike): Partial<SiteSignals> {
  const audits = psi.lighthouseResult?.audits ?? {};
  const categories = psi.lighthouseResult?.categories ?? {};
  const urls = resourceUrlsFromPsi(psi);

  const viewport = audits.viewport?.score;
  const crawlable = audits["is-crawlable"]?.score;
  const robots = audits["robots-txt"]?.score;
  const perf = categories.performance?.score;
  const lcp = audits["largest-contentful-paint"]?.numericValue;

  const fromUrls = urls.length > 0 ? detectFromResourceUrls(urls) : {};

  return {
    ...fromUrls,
    mobileFriendly: typeof viewport === "number" ? viewport >= 0.5 : null,
    crawlable:
      typeof crawlable === "number"
        ? crawlable >= 0.5 && (typeof robots !== "number" || robots >= 0.5)
        : null,
    performanceScore: typeof perf === "number" ? Math.round(perf * 100) : null,
    lcpSeconds: typeof lcp === "number" ? Math.round(lcp / 100) / 10 : null,
  };
}

const NAME_FIELDS = new Set(["chatWidget", "bookingTool", "ecommercePlatform", "captcha"]);
const BOOLEAN_OR_FIELDS = new Set(["metaPixel", "gtm", "ga4", "serverSideTagging", "shopPay", "captcha", "botChallenge"]);

/**
 * Combine partial observations. `null`/`undefined` never overwrite a known value.
 * Presence signals (pixels, tools) are OR-ed: if any source saw it, it is there.
 */
export function mergeSignals(...parts: Array<Partial<SiteSignals>>): SiteSignals {
  const merged = emptySignals() as unknown as Record<string, unknown>;
  for (const part of parts) {
    for (const [key, value] of Object.entries(part)) {
      if (value === null || value === undefined) continue;
      const current = merged[key];
      if (NAME_FIELDS.has(key) && typeof current === "string" && current && !value) continue;
      if (BOOLEAN_OR_FIELDS.has(key) && current === true && value === false) continue;
      merged[key] = value;
    }
  }
  return merged as unknown as SiteSignals;
}
