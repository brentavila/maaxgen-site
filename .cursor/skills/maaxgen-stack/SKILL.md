---
name: maaxgen-stack
description: Astro conventions for the MaaxGen marketing site (maaxgen-site). Use when adding pages, layouts, components, content collections, styles, or running dev/build for this repo.
disable-model-invocation: true
---

# MaaxGen Stack (Astro)

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## Structure

```
src/
  layouts/     BaseLayout.astro — header, footer, global CSS
  components/  Reusable UI (Header, Footer, Button, etc.)
  pages/       File-based routes
  styles/      global.css — DESIGN.md tokens
public/
  brand/       Logo assets
```

## Pages

- `index.astro` — home
- `services.astro`, `pricing.astro`, `contact.astro`, `about.astro`
- `case-studies/index.astro`, `case-studies/[slug].astro` — case study listing + detail
- `blog/index.astro` — blog listing (content collection later)
- `privacy.astro`, `terms.astro` — legal stubs

## Styling

- CSS variables from [DESIGN.md](../../../DESIGN.md) in `src/styles/global.css`
- Prefer semantic HTML and minimal JS; no React unless added explicitly
- Respect `prefers-reduced-motion`

## Content

- Case studies: `src/content/case-studies/` — collection `caseStudies` in `src/content/config.ts`
- Blog: Astro content collection `src/content/blog/` when posts are added
- Contact form: static HTML form v1; wire backend (Formspree, etc.) later

## Context

Always align with [PRODUCT.md](../../../PRODUCT.md) and [DESIGN.md](../../../DESIGN.md).
