---
name: maaxgen
description: Orchestrates MaaxGen marketing site work in maaxgen-site. Loads PRODUCT.md and DESIGN.md, routes design tasks to impeccable (brand register), motion to design-motion-principles (Jakub/Jhey weighting), and stack work to maaxgen-stack. Use for MaaxGen website, landing pages, services, case studies, pricing, blog, or contact pages.
disable-model-invocation: true
---

# MaaxGen Site

## Before any UI work

1. Read [PRODUCT.md](../../../PRODUCT.md) and [DESIGN.md](../../../DESIGN.md) at the repo root.
2. Register is **brand** (marketing site). Use impeccable's [brand reference](https://github.com/pbakaus/impeccable) patterns.
3. Run impeccable context loader when using impeccable commands:
   ```bash
   node .cursor/skills/impeccable/scripts/load-context.mjs
   ```

## Skill routing

| Task | Skill |
|------|--------|
| Layout, color, typography, UX copy, polish, audit, craft pages | `impeccable` |
| Transitions, hover, enter/exit, motion audit | `design-motion-principles` (personal: `~/.cursor/skills/`) |
| Astro structure, routes, content collections, build | `maaxgen-stack` |

## Site map

| Route | File |
|-------|------|
| `/` | `src/pages/index.astro` |
| `/services` | `src/pages/services.astro` |
| `/case-studies` | `src/pages/case-studies/index.astro` |
| `/case-studies/[slug]` | `src/pages/case-studies/[slug].astro` |
| `/pricing` | `src/pages/pricing.astro` |
| `/contact` | `src/pages/contact.astro` |
| `/blog` | `src/pages/blog/index.astro` |
| `/about` | `src/pages/about.astro` |

Nav: Home, Services, Case studies, Pricing, Blog, Contact. Footer: About, Case studies, Privacy, Terms.

## Case studies

Content: `src/content/case-studies/*.md` (Astro collection `caseStudies`). See PRODUCT.md for v1 structure and layout rules.

## Brand reminders

- Light-first; brand blue `#0072BC`, slate `#414B56`
- Logos in `public/brand/` — `logo-lockup.png`
- Bundle / all-in-one positioning for local + e-commerce SMBs
- Primary CTAs: Book a call, Get started

## Motion default

Marketing site: Jakub primary, Jhey secondary, Emil selective (forms/nav only).
