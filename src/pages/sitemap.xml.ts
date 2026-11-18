import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { industries } from "../data/industries";
import { isPromoActive } from "../data/promo";
import { NOINDEX_PATHS, SITE_URL, canonicalPath } from "../data/site";

const pageModules = import.meta.glob("/src/pages/**/*.astro");

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Valid W3C date (YYYY-MM-DD) or undefined. */
const day = (value: string | undefined) => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
};

export const GET: APIRoute = async () => {
  const entries = new Map<string, string | undefined>();
  const add = (path: string, lastmod?: string) => {
    const p = canonicalPath(path);
    if (NOINDEX_PATHS.includes(p)) return;
    if (!entries.has(p) || (lastmod && !entries.get(p))) entries.set(p, day(lastmod));
  };

  // Static routes: every page file except dynamic ones.
  for (const file of Object.keys(pageModules)) {
    const route = file
      .replace("/src/pages", "")
      .replace(/\.astro$/, "")
      .replace(/\/index$/, "");
    if (route.includes("[")) continue;
    if (route === "/black-friday" && !isPromoActive(new Date())) continue;
    add(route || "/");
  }

  // Industry hub plus every industry page (handles zero industries).
  if (industries.length > 0) add("/industries/");
  for (const industry of industries) add(`/industries/${industry.slug}/`, industry.updated);

  // Content collections. Case studies carry no date, so no lastmod.
  const posts = (await getCollection("blog")).filter((post) => !post.data.draft);
  for (const post of posts) add(`/blog/${post.id}/`, post.data.publishDate);
  for (const study of await getCollection("caseStudies")) add(`/case-studies/${study.id}/`);

  const urls = [...entries]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, lastmod]) => {
      const loc = esc(`${SITE_URL}${path}`);
      return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
