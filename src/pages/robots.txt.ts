import type { APIRoute } from "astro";
import { SITE_URL } from "../data/site";

export const GET: APIRoute = () => {
  // Allow everything, including AI crawlers (no per-bot blocks), so the site can be
  // read and quoted by search and answer engines. Noindex pages are handled by the
  // meta robots tag, not by Disallow: a disallowed URL cannot be crawled, so a
  // crawler would never see its noindex tag.
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
