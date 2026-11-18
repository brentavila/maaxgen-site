/** Browser identifiers attached to every lead (BrowserIds in contract.ts). */
import type { BrowserIds } from "./contract";
import { getAttribution } from "./attribution";
import { readCookie } from "./cookies";

/** GA4 stream cookie suffix for G-W5R65NR85B. */
const GA4_SESSION_COOKIE = "_ga_W5R65NR85B";

/** "GA1.1.123456789.1700000000" -> "123456789.1700000000". */
export function parseGaClientId(cookie: string): string {
  const m = cookie.match(/^GA\d\.\d+\.(\d+\.\d+)$/);
  return m ? m[1] : "";
}

/**
 * Session id from the GA4 stream cookie. Handles both formats:
 *   "GS1.1.1700000000.3.1.1700000100.0.0.0"     -> "1700000000"
 *   "GS2.1.s1700000000$o3$g1$t1700000100$j0..."  -> "1700000000"
 */
export function parseGaSessionId(cookie: string): string {
  if (!cookie) return "";
  const gs2 = cookie.match(/^GS2\.\d+\.s(\d+)/);
  if (gs2) return gs2[1];
  const gs1 = cookie.match(/^GS1\.\d+\.(\d+)\./);
  return gs1 ? gs1[1] : "";
}

export function getBrowserIds(): BrowserIds {
  let fbc = readCookie("_fbc");
  if (!fbc) {
    try {
      const { last, first } = getAttribution();
      const touch = last.params.fbclid ? last : first.params.fbclid ? first : null;
      if (touch) {
        const at = Date.parse(touch.at);
        fbc = `fb.1.${Number.isFinite(at) ? at : Date.now()}.${touch.params.fbclid}`;
      }
    } catch {
      /* attribution unavailable */
    }
  }
  return {
    fbp: readCookie("_fbp"),
    fbc,
    gaClientId: parseGaClientId(readCookie("_ga")),
    gaSessionId: parseGaSessionId(readCookie(GA4_SESSION_COOKIE)),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    pageUrl: typeof location !== "undefined" ? location.href : "",
    pageTitle: typeof document !== "undefined" ? document.title : "",
  };
}
