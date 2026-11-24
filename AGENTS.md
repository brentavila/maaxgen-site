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
- Service Studio (homepage hero, shortlist, plan dialog):
  - Catalogue and copy: `src/data/services.ts`
  - Hero: `src/components/studio/ServiceStudio.astro`; logic `src/scripts/studio.ts`; styles `src/styles/studio.css`
  - Card illustrations: `src/components/studio/ServiceVisual.astro`
  - Shortlist logic: `src/lib/shortlist.ts` (localStorage key `maaxgen-interested-services`)
  - Shortlist pill and plan dialog: `src/components/studio/ShortlistPill.astro`, `src/components/studio/PlanDialog.astro`, mounted in `src/layouts/BaseLayout.astro`
  - When testing, never submit the plan or contact form to the live webhook; stub `window.fetch` instead.
- Promotions (Black Friday / Cyber Monday, promo id `bfcm-2026`):
  - Config and terms: `src/data/promo.ts`. The window is set by the `PROMO_START` and `PROMO_END` strings at the top of the file (currently 16 November 2026 through the end of 30 November 2026, US Mountain Time).
  - Terms are exactly three statements: 15-day risk-free trial (first month paid at kickoff, full refund if cancelled by day 15; never "free trial"), no monthly contract, setup fee waived for a marketing text opt-in. SMS consent wording lives in `src/lib/sms-consent.ts` and renders through `src/components/forms/SmsConsent.astro`.
  - Self-expiry: promo elements hide themselves outside the window at build time and again in the browser at view time. No rebuild is needed when it ends.
  - Surfaces and files:
    - Top promo bar: `src/components/Header.astro`
    - Homepage band: `src/components/promo/PromoBand.astro`
    - Offer page with claim form: `src/pages/black-friday.astro` (`/black-friday`)
    - Callout: `src/pages/pricing.astro`
    - One-line note: `src/pages/contact.astro` and `src/components/studio/PlanDialog.astro`
    - Styles: `src/styles/promo.css`
  - The claim form posts to the same lead webhook as the contact form with `leadSource: "bfcm-2026"`.
  - The claim form, contact form, and plan dialog all send `promoId` and `promoName` (empty strings when no promotion is active).
- Founder photos (Brent Avila):
  - Three are in use: `founder-portrait` (/about hero), `founder-office` (homepage band), `founder-phone` (/contact). `founder-client` and `founder-desk` are empty, so those placements stay hidden until the named files (see `src/assets/founder/README.md`) are added; the video also needs `FOUNDER_DESK_VIDEO_AVAILABLE` in `founder-assets.ts`.
  - Rendered through Astro's image pipeline by `src/components/founder/FounderImage.astro`. Styles: `src/styles/founder.css`.
  - Exactly five placements:
    - Homepage band: `src/components/founder/FounderBand.astro` (used in `src/pages/index.astro`)
    - `/about` (`src/pages/about.astro`): hero portrait; a short muted video loop `public/video/founder/founder-desk-broll.mp4` in the story section; a photo beside the final call to action
    - `/contact` (`src/pages/contact.astro`): one small photo
  - Rule: do not add founder photos to other pages unless asked.

- Conversion tracking (setup guide: `tracking/SETUP.md`):
  - Contract (events, CRM keys, lead values): `src/lib/tracking/contract.ts`. Browser API: `submitLead()` and `track()` from `src/lib/tracking`. No component calls `fbq`, `gtag`, or `dataLayer.push` directly.
  - Every lead form posts to `/api/lead` (`src/pages/api/lead.ts`, the only on-demand route, Vercel adapter), which forwards to `LEAD_WEBHOOK_URL` (GHL/n8n) and Meta CAPI with a shared event id.
  - The Meta Pixel is hardcoded in `ConsentManager.astro`; GTM (`tracking/gtm/`) handles GA4 and Google Ads only and must contain no Meta tags. Google Ads Google tag + conversion tags: `tracking/gtm/README.md`; smoke: `npm run verify:gtm-ads`.
  - `/api/lead` dry-runs under `astro dev` without `LEAD_WEBHOOK_URL`, or with `TRACKING_DRY_RUN=1`.

## Brand

MaaxGen — marketing, advertising, and AI agency; bundled services for local and e-commerce SMBs. Light-first theme. No Inter, no purple gradients.

## Cursor Cloud specific instructions

Single service: Astro 6 static marketing site (Node `>=22.12`, npm + `package-lock.json`). Commands: see `package.json` (`npm run dev` → `http://localhost:4321/`, `npm run build`). No ESLint/`astro check` package is declared — treat a clean `npm run build` as the type/content gate. Funnel scoring smoke: `node scripts/verify-funnel-scoring.mjs`. Google Ads / GTM smoke: `npm run verify:gtm-ads`.

Optional env (`.env.example`): `PUBLIC_VSL_*` / `PUBLIC_GHL_*` only affect Growth System VSL video, calendar embed, and webhook submits; the site and Ad Account Grader run without them. Growth System `/growth-system/results` is client-rendered from session state after `/growth-system/qualify` — a cold load of results with no prior answers shows the empty CTA, not a grade. For a quick interactive smoke test, prefer `/ad-account-grader` (five questions → on-page letter grade).