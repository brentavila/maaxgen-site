/**
 * First-party attribution (see AttributionState in contract.ts).
 *
 * - first: set once, never overwritten while the cookie lives.
 * - last:  replaced when a landing carries a utm or click id, or when a new session starts from an
 *          external referrer (organic search, referral). Direct and internal visits never replace it.
 * - sessions: +1 after 30 minutes without a page view.
 *
 * Stored in cookie mx_attr (base64url JSON) on .maaxgen.com, mirrored to localStorage.
 * Last activity time lives in cookie mx_seen (ms timestamp) so the idle rule spans subdomains.
 */
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_DAYS,
  CLICK_ID_KEYS,
  UTM_KEYS,
  type AttributionState,
  type Touch,
} from "./contract";
import { readCookie, writeCookie } from "./cookies";

const STORAGE_KEY = ATTRIBUTION_COOKIE;
const SEEN_COOKIE = "mx_seen";
const SESSION_IDLE_MS = 30 * 60 * 1000;
const MAX_URL = 600;
const MAX_PARAM = 200;

const SEARCH_ENGINES: Array<[RegExp, string]> = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)search\.yahoo\./, "yahoo"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)yandex\./, "yandex"],
  [/(^|\.)baidu\.com$/, "baidu"],
  [/(^|\.)ecosia\.org$/, "ecosia"],
  [/(^|\.)search\.brave\.com$/, "brave"],
];

// --- encoding --------------------------------------------------------------

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function isState(v: unknown): v is AttributionState {
  const s = v as AttributionState;
  return Boolean(s && typeof s === "object" && s.first && s.last && typeof s.first.source === "string");
}

// --- storage ---------------------------------------------------------------

function readStored(): AttributionState | null {
  const cookie = readCookie(ATTRIBUTION_COOKIE);
  if (cookie) {
    try {
      const parsed = JSON.parse(fromBase64Url(cookie));
      if (isState(parsed)) return parsed;
    } catch {
      /* fall through to localStorage */
    }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isState(parsed)) return parsed;
    }
  } catch {
    /* storage blocked */
  }
  return null;
}

function writeStored(state: AttributionState): void {
  const json = JSON.stringify(state);
  writeCookie(ATTRIBUTION_COOKIE, toBase64Url(json), ATTRIBUTION_MAX_AGE_DAYS);
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch {
    /* storage blocked */
  }
}

function readLastSeen(): number {
  const fromCookie = Number(readCookie(SEEN_COOKIE));
  if (fromCookie) return fromCookie;
  try {
    return Number(localStorage.getItem(SEEN_COOKIE)) || 0;
  } catch {
    return 0;
  }
}

function writeLastSeen(ms: number): void {
  writeCookie(SEEN_COOKIE, String(ms), ATTRIBUTION_MAX_AGE_DAYS);
  try {
    localStorage.setItem(SEEN_COOKIE, String(ms));
  } catch {
    /* storage blocked */
  }
}

// --- touch derivation ------------------------------------------------------

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isInternalHost(host: string): boolean {
  if (!host) return false;
  const here = location.hostname.toLowerCase().replace(/^www\./, "");
  return host === here || host === "maaxgen.com" || host.endsWith(".maaxgen.com");
}

/** Build a Touch from a URL and referrer. Exported for testing. */
export function touchFromUrl(href: string, referrer: string, at: Date = new Date()): Touch {
  const url = new URL(href);
  const params: Touch["params"] = {};
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const v = url.searchParams.get(key);
    if (v) params[key] = v.slice(0, MAX_PARAM);
  }

  const refHost = hostOf(referrer);
  const externalRef = refHost && !isInternalHost(refHost) ? refHost : "";
  const engine = externalRef ? SEARCH_ENGINES.find(([re]) => re.test(externalRef))?.[1] : undefined;

  let clickSource = "";
  if (params.gclid || params.gbraid || params.wbraid) clickSource = "google";
  else if (params.fbclid) clickSource = "facebook";
  else if (params.msclkid) clickSource = "bing";
  else if (params.ttclid) clickSource = "tiktok";
  else if (params.li_fat_id) clickSource = "linkedin";

  const source = params.utm_source || clickSource || engine || externalRef || "(direct)";
  const medium =
    params.utm_medium ||
    (clickSource ? "cpc" : engine ? "organic" : externalRef ? "referral" : params.utm_source ? "(not set)" : "(none)");

  return {
    params,
    source,
    medium,
    landingPage: href.slice(0, MAX_URL),
    referrer: externalRef ? referrer.slice(0, MAX_URL) : "",
    at: at.toISOString(),
  };
}

function hasCampaignSignal(t: Touch): boolean {
  return Object.keys(t.params).length > 0;
}

/** The fbclid part of an _fbc value "fb.<sub>.<ms>.<fbclid>" (the fbclid itself may contain dots). */
function fbclidFromFbc(fbc: string): string {
  const m = fbc.match(/^fb\.\d+\.\d+\.(.+)$/);
  return m ? m[1] : "";
}

// --- public API ------------------------------------------------------------

let cached: AttributionState | null = null;
let capturedThisPage = false;

/**
 * Run once per page load (initTracking does this). Updates first/last/sessions, persists them,
 * and sets _fbc from a new fbclid when the pixel has not set one yet.
 */
export function captureAttribution(): AttributionState {
  if (capturedThisPage && cached) return cached;
  const now = new Date();
  const touch = touchFromUrl(location.href, document.referrer, now);
  const lastSeen = readLastSeen();
  const newSession = !lastSeen || now.getTime() - lastSeen > SESSION_IDLE_MS;

  let state = readStored();
  if (!state) {
    state = { first: touch, last: touch, sessions: 1 };
  } else {
    const nonDirectSessionStart = newSession && touch.source !== "(direct)";
    if (hasCampaignSignal(touch) || nonDirectSessionStart) state.last = touch;
    if (newSession) state.sessions = (state.sessions || 0) + 1;
  }

  writeStored(state);
  writeLastSeen(now.getTime());

  const fbclid = touch.params.fbclid;
  // Meta wants _fbc to reflect the most recent fbclid: write it when missing or when it holds another fbclid.
  if (fbclid && fbclidFromFbc(readCookie("_fbc")) !== fbclid) {
    writeCookie("_fbc", `fb.1.${now.getTime()}.${fbclid}`, ATTRIBUTION_MAX_AGE_DAYS);
  }

  cached = state;
  capturedThisPage = true;
  return state;
}

/** Current attribution. Captures first if this page has not run capture yet. */
export function getAttribution(): AttributionState {
  if (cached) return cached;
  try {
    return captureAttribution();
  } catch {
    const touch: Touch = {
      params: {},
      source: "(direct)",
      medium: "(none)",
      landingPage: typeof location !== "undefined" ? location.href : "",
      referrer: "",
      at: new Date().toISOString(),
    };
    return { first: touch, last: touch, sessions: 1 };
  }
}
