/**
 * Presentation helpers for the industry pages. No copy lives here: every
 * customer-facing string comes from src/data/industries/verticals/*.ts.
 */
import type { Industry, IndustryPlay } from "../../data/industries";
import { serviceById } from "../../data/services";

/** Words that keep their capital letter mid-sentence. */
const PROPER = new Set(["Shopify"]);

/** "Garage door" -> "garage door" for use inside a sentence; proper nouns are kept. */
export function inSentence(text: string): string {
  const first = text.split(/\s+/)[0] ?? "";
  if (PROPER.has(first) || !/^[A-Z][a-z]/.test(text)) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export const stageLabel = (industry: Industry, id: string): string =>
  industry.stages.find((s) => s.id === id)?.label ?? id;

export const serviceName = (id: string): string => serviceById(id)?.name ?? id;

export const serviceNum = (id: string): string => serviceById(id)?.num ?? "";

/** Lowercase haystack for the hero search, mirroring the homepage studio's data-search. */
export function playSearchText(industry: Industry, play: IndustryPlay): string {
  return [
    play.name,
    play.problem,
    play.headline.join(" "),
    play.summary,
    stageLabel(industry, play.stage),
    ...play.whatWeDo,
    ...play.services.map(serviceName),
  ]
    .join(" ")
    .toLowerCase();
}

/** The day the industry pages went live: WebPage `datePublished` on every industry page. */
export const INDUSTRY_LAUNCH_DATE = "2026-11-17";

/** Founder entity, defined once in BaseLayout's site-wide Organization JSON-LD. */
export const founderRef = (origin: string) => ({ "@id": `${origin}/#founder` });

export const pageUrl =(origin: string, slug: string) => `${origin}/industries/${slug}/`;

/**
 * Each page gets its own light behind the hero, keyed to its illustrations' tints.
 * Values are OKLCH hues for the two soft washes; chroma stays as low as the homepage's.
 */
const WASH: Record<string, [number, number]> = {
  "garage-door-companies": [78, 238],
  "auto-repair-shops": [60, 250],
  "shopify-stores": [238, 200],
  "used-car-dealerships": [85, 228],
  "law-firms": [250, 225],
  "kitchen-bath-remodelers": [150, 78],
};
export const washHues = (slug: string): [number, number] => WASH[slug] ?? [78, 238];
