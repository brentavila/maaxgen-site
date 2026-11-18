/**
 * Contract for the industry landing pages at /industries/<slug>.
 *
 * One file per vertical in ./verticals/<slug>.ts, each default-exporting an
 * `Industry`. The page template, the JSON-LD, the markdown alternate, the
 * sitemap, and llms.txt are all generated from this data, so every string here
 * is customer-facing and machine-read.
 *
 * Copy rules: speak to the owner or manager in that industry, in their words.
 * No fees, no invented numbers, results, client names, awards, or guarantees.
 * Character limits are hard limits: the layout is sized for them.
 */

/** A service id from src/data/services.ts (for example "google-ads"). */
export type ServiceId = string;

/** A filter pill above the hero deck. Each industry defines 3 or 4 of its own. */
export interface IndustryStage {
  id: string;
  /** Max 14 characters. */
  label: string;
}

/** The illustration on a play card. */
export type PlayVisual =
  /** A bespoke illustration from IndustryVisual.astro. */
  | { kind: "industry"; id: string }
  /** A service illustration from ServiceVisual.astro. `query` replaces the typed search text on "google-ads". */
  | { kind: "service"; id: ServiceId; query?: string };

/** One card in the hero deck: a problem this industry has, and the fix. */
export interface IndustryPlay {
  /** Kebab-case, unique within the industry. Deep link: /industries/<slug>#play/<id>. */
  id: string;
  /** "01".."06". */
  num: string;
  /** Card title: the fix, named plainly. Max 28 characters. */
  name: string;
  /** One of this industry's stage ids. */
  stage: string;
  /** The pain in the owner's own words. Max 70 characters. */
  problem: string;
  /** Detail headline in two lines; line two renders muted italic. Max 24 characters per line. */
  headline: [string, string];
  /** One or two sentences starting from the owner's situation. Max 240 characters. */
  summary: string;
  /** Exactly 4 concrete things MaaxGen does. Max 52 characters each. */
  whatWeDo: string[];
  /** One sentence on what changes. No numbers. Max 130 characters. */
  outcome: string;
  /** 1 to 3 services this play draws on. Adding the play adds these to the shortlist. */
  services: ServiceId[];
  visual: PlayVisual;
}

type BlockBase = {
  /** Kebab-case anchor id, unique on the page. */
  id: string;
  /** Small label above the heading. Max 40 characters. */
  eyebrow: string;
  /** Section h2. Phrase it as the question or statement an owner would search. Max 80 characters. */
  heading: string;
  /** Optional one or two sentences under the heading. Max 260 characters. */
  intro?: string;
  /** Background rhythm. Vary it down the page. */
  tone: "light" | "surface" | "dark";
};

/** Pain points and what each one costs the business. 3 to 5 items. */
export type PainsBlock = BlockBase & {
  type: "pains";
  items: { title: string; body: string; cost: string }[];
};

/** Side-by-side comparison of 2 or 3 kinds of customer, job, or funnel. */
export type LanesBlock = BlockBase & {
  type: "lanes";
  lanes: {
    label: string;
    who: string;
    /** 3 to 5 short rows, each a label and a value, the same labels in every lane. */
    rows: { label: string; value: string }[];
  }[];
};

/** An ordered sequence: a lead's journey, a pipeline, a first-90-days plan. 3 to 6 steps. */
export type FlowBlock = BlockBase & {
  type: "flow";
  steps: { label: string; title: string; body: string }[];
};

/** A real data table. 2 to 4 columns, 3 to 7 rows. Renders as <table> with a caption. */
export type TableBlock = BlockBase & {
  type: "table";
  caption: string;
  columns: string[];
  rows: string[][];
};

/** The numbers that matter in this industry: term, plain definition, why it matters. 3 to 6 items. No values. */
export type MetricsBlock = BlockBase & {
  type: "metrics";
  items: { term: string; definition: string; why: string }[];
};

/** Grouped checklist. 2 to 4 groups of 3 to 5 items. */
export type ChecklistBlock = BlockBase & {
  type: "checklist";
  groups: { title: string; items: string[] }[];
};

/** A short prose note, for example on advertising rules in a regulated industry. 1 to 3 paragraphs. */
export type NoteBlock = BlockBase & {
  type: "note";
  body: string[];
};

export type IndustryBlock =
  | PainsBlock
  | LanesBlock
  | FlowBlock
  | TableBlock
  | MetricsBlock
  | ChecklistBlock
  | NoteBlock;

export interface IndustryFaq {
  /** The question as an owner would type or ask it. Max 110 characters. */
  q: string;
  /** Answer-first: the first sentence answers the question on its own. 40 to 90 words. Plain text. */
  a: string;
}

export interface Industry {
  /** URL slug under /industries/. Fixed by the conductor; do not change. */
  slug: string;
  /** 1 is highest priority. Fixed by the conductor. */
  priority: number;
  /** Plural audience noun, sentence case: "Garage door companies". */
  name: string;
  /** Short label for navigation and cards: "Garage door". Max 22 characters. */
  shortName: string;
  /** Who the page speaks to: "garage door company owners and managers". */
  audience: string;
  /** ISO date the copy was last reviewed (YYYY-MM-DD). */
  updated: string;

  seo: {
    /** <title>, without the site name. Max 55 characters. Lead with the search phrase. */
    title: string;
    /** Meta description. 120 to 155 characters. */
    description: string;
    /** schema.org Service.serviceType: "Garage door company marketing". */
    serviceType: string;
    /** 5 to 10 search phrases this page should answer. Used in llms.txt, not stuffed on the page. */
    keywords: string[];
    /**
     * One sentence naming MaaxGen, what it runs, and for whom: "MaaxGen plans and runs ... for garage
     * door repair and installation companies." Shown near the h1 and used as the Service description.
     * Only services from src/data/services.ts. 90 to 200 characters.
     */
    serviceSummary: string;
  };

  hero: {
    /** Small label above the h1. Max 48 characters. */
    kicker: string;
    /** The page h1 in two lines; line two renders muted italic. Max 30 characters per line. */
    headline: [string, string];
    /** Max 240 characters. */
    lead: string;
    /** Primary button, scrolls to the form. Max 26 characters. */
    ctaLabel: string;
    /** One quiet line under the buttons. Max 80 characters. */
    reassurance: string;
  };

  /** The direct answer block right under the hero, written to be quoted by search and AI answers. */
  answer: {
    /** The question the page answers: "How do garage door companies get more booked jobs?" */
    question: string;
    /** 45 to 70 words, self-contained, names MaaxGen once at most. */
    answer: string;
    /** 3 or 4 key takeaways, max 110 characters each. */
    points: string[];
  };

  /** 3 or 4 stages. */
  stages: IndustryStage[];
  /** Exactly 6 plays, ordered as they should appear in the deck. */
  plays: IndustryPlay[];
  /** 3 to 5 services to add in one click as "the <industry> stack". */
  recommendedServices: ServiceId[];

  /** 4 to 6 blocks. Composition and order should differ between industries. */
  blocks: IndustryBlock[];

  /**
   * 8 to 10 questions real owners in this industry ask before hiring a marketing partner. Include
   * "What does a <industry> marketing agency do?" and "How do I choose a marketing agency for my <business>?"
   * in the owner's wording. No pricing question: fees are not discussed on the site.
   */
  faqs: IndustryFaq[];

  /**
   * Two inline call-to-action lines placed after the 2nd content block and after the last one. Each
   * picks up the topic of the block above it and leads into the hero's primary button. Max 140 characters each.
   */
  ctaLines: [string, string];

  form: {
    /** Max 60 characters. */
    heading: string;
    /** Max 200 characters. */
    intro: string;
    /** One qualifying question as a select. 4 to 6 options, max 44 characters each. */
    qualifier: { label: string; options: string[] };
    /** Value sent as businessType, matching the contact form's values. */
    businessType: "local" | "ecommerce" | "both";
    /** Max 28 characters. */
    submitLabel: string;
    /** Placeholder for the optional note, naming what this trade should tell us. Max 90 characters. */
    notePlaceholder: string;
    /** Optional quiet line under the note, for example a confidentiality request. Max 110 characters. */
    noteHint?: string;
    /**
     * The business field. Defaults to an optional "Business name or website". An industry can make
     * it required and relabel it (Shopify: "Store URL"). Label max 32, placeholder max 40 characters.
     */
    siteField?: { label: string; placeholder: string; required: boolean };
  };

  /** One sentence for this industry's card on the /industries hub. Max 140 characters. */
  hubBlurb: string;
}
