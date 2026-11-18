import type { Industry } from "./types";

/**
 * Every file in ./verticals/ default-exports an Industry and is registered
 * automatically. Add a vertical by adding a file; nothing else to wire.
 */
const modules = import.meta.glob<{ default: Industry }>("./verticals/*.ts", { eager: true });

export const industries: Industry[] = Object.values(modules)
  .map((module) => module.default)
  .sort((a, b) => a.priority - b.priority);

export const industryBySlug = (slug: string): Industry | undefined =>
  industries.find((industry) => industry.slug === slug);

export type * from "./types";
