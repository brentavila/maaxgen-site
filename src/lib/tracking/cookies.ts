/** Browser cookie helpers for the tracking layer. */
import { COOKIE_DOMAIN } from "./contract";

export function readCookie(name: string): string {
  try {
    const prefix = `${name}=`;
    for (const part of document.cookie.split(";")) {
      const c = part.trim();
      if (c.startsWith(prefix)) return decodeURIComponent(c.slice(prefix.length));
    }
  } catch {
    /* cookies blocked */
  }
  return "";
}

/**
 * ".maaxgen.com" on maaxgen.com and its subdomains; "" (host-only cookie) everywhere else,
 * for example localhost or *.vercel.app previews, where a foreign domain attribute would be rejected.
 */
export function cookieDomainFor(hostname: string = location.hostname): string {
  const root = COOKIE_DOMAIN.replace(/^\./, "");
  return hostname === root || hostname.endsWith(COOKIE_DOMAIN) ? COOKIE_DOMAIN : "";
}

export function writeCookie(name: string, value: string, maxAgeDays: number): void {
  try {
    const parts = [
      `${name}=${encodeURIComponent(value)}`,
      "path=/",
      `max-age=${Math.round(maxAgeDays * 86400)}`,
      "SameSite=Lax",
    ];
    const domain = cookieDomainFor();
    if (domain) parts.push(`domain=${domain}`);
    if (location.protocol === "https:") parts.push("Secure");
    document.cookie = parts.join("; ");
  } catch {
    /* cookies blocked */
  }
}
