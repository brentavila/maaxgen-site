# Agent context

When working on this repository, read:

- [PRODUCT.md](./PRODUCT.md) — product purpose, audience, tone, CTAs, anti-patterns
- [DESIGN.md](./DESIGN.md) — colors, typography, layout, motion, components

Skills for UI and motion: [.cursor/skills/](./.cursor/skills/)

Codex handoff prompt: [CODEX_HANDOFF.md](./CODEX_HANDOFF.md)

## Stack

- Astro static marketing site
- Global styles: `src/styles/global.css`
- Layout: `src/layouts/BaseLayout.astro`

## Brand

MaaxGen — marketing, advertising, and AI agency; bundled services for local and e-commerce SMBs. Light-first theme. No Inter, no purple gradients.

## Cursor Cloud specific instructions

Single service: Astro 6 static marketing site (Node `>=22.12`, npm + `package-lock.json`). Commands: see `package.json` (`npm run dev` → `http://localhost:4321/`, `npm run build`). No ESLint/`astro check` package is declared — treat a clean `npm run build` as the type/content gate. Funnel scoring smoke: `node scripts/verify-funnel-scoring.mjs`.

Optional env (`.env.example`): `PUBLIC_VSL_*` / `PUBLIC_GHL_*` only affect Growth System VSL video, calendar embed, and webhook submits; the site and Ad Account Grader run without them. Growth System `/growth-system/results` is client-rendered from session state after `/growth-system/qualify` — a cold load of results with no prior answers shows the empty CTA, not a grade. For a quick interactive smoke test, prefer `/ad-account-grader` (five questions → on-page letter grade).