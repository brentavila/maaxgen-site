/**
 * Single source of truth for the production origin and organisation facts.
 * Used by astro.config.mjs (`site`), BaseLayout (canonical, Open Graph, JSON-LD),
 * sitemap.xml, robots.txt and llms.txt.
 *
 * ASSUMPTION: the production origin is https://maaxgen.com. The owner must confirm
 * it. Change this one constant (no trailing slash) if the live domain differs.
 */
export const SITE_URL = "https://maaxgen.com";

export const SITE_NAME = "MaaxGen";

/** Copied from the site's default meta description and footer tagline. */
export const SITE_DESCRIPTION =
  "Marketing, advertising, and AI for local and e-commerce businesses.";

/**
 * One sentence on who MaaxGen serves and what it does, for the site-wide Organization
 * JSON-LD. Kept separate from SITE_DESCRIPTION, which llms.txt embeds mid-sentence.
 */
export const SITE_ORG_DESCRIPTION =
  "MaaxGen is a marketing, advertising, and AI agency that plans and runs ads, websites, SEO, creative, and AI follow-up as one bundle for local businesses and e-commerce stores.";

/** The logo the header already uses (served from /public). */
export const SITE_LOGO_PATH = "/brand/Maaxgen Vector Logo with Icon.svg";

/** Raster logo for structured data (search engines do not accept SVG logos). Same artwork family as the header logo. */
export const SITE_LOGO_PNG_PATH = "/brand/Maaxgen Logo with Icon 500 x 500.png";

/** Absolute URL for a site path. */
export function absoluteUrl(path: string): string {
  return new URL(encodeURI(path).replace(/%25/g, "%"), SITE_URL).toString();
}

/**
 * Trailing-slash policy: page URLs end in "/" (matching the build's
 * `dist/<route>/index.html` output); file-like URLs (sitemap.xml, llms.txt,
 * *.md) never do.
 */
export function canonicalPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (/\.[a-z0-9]+$/i.test(p) || p.endsWith("/")) return p;
  return `${p}/`;
}

/**
 * Routes that must not be indexed. Pages pass `noindex` to BaseLayout; the
 * sitemap uses this list to leave them out. Keep the two in step.
 */
export const NOINDEX_PATHS = [
  "/thank-you/",
  "/404/",
  "/growth-system/results/",
  "/growth-system/book/",
  "/growth-system/qualify/",
];
