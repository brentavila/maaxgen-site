# MaaxGen Design System

## Theme

Light-first marketing site. White page background. Optional dark mode is out of scope for v1.

## Color (OKLCH)

Use CSS custom properties. Tint neutrals toward brand blue hue (chroma ~0.01).

| Token | Role | Hex reference |
|-------|------|---------------|
| `--color-brand` | Primary accent, links, MAAX wordmark | `#0072BC` |
| `--color-brand-muted` | Hover, subtle fills | `#005a94` |
| `--color-slate` | Secondary, GEN wordmark, headings alt | `#414B56` |
| `--color-bg` | Page background | `#FFFFFF` |
| `--color-fg` | Body text (tinted near-black, not pure black) | `oklch(0.22 0.02 250)` |
| `--color-muted` | Secondary text | `oklch(0.45 0.02 250)` |
| `--color-border` | Dividers, inputs | `oklch(0.88 0.01 250)` |
| `--color-surface` | Cards, elevated sections | `oklch(0.98 0.005 250)` |

## Typography

- **Display / headings:** Wide, bold sans with moderate letter-spacing (logo-adjacent feel). Prefer **DM Sans**, **Outfit**, or **Plus Jakarta Sans** over Inter.
- **Body:** Clean sans at 16–18px base, 1.5–1.65 line height.
- **Scale:** Clear hierarchy; minimum 1.25 ratio between heading steps.
- Hero headlines may use a second line in muted italic Plus Jakarta Sans (400/500); small uppercase labels may use the system monospace stack.

## Logo assets

Place files in `public/brand/` when available:

- `logo-lockup.svg` or `logo-lockup.png` — icon + MAAXGEN wordmark (header)
- `logo-icon.svg` or `logo-icon.png` — icon only (favicon, compact nav)
- `logo-wordmark.svg` — text only if needed

Wordmark treatment: **MAAX** in brand blue, **GEN** in slate (match supplied logos).

## Layout

- Max content width ~72rem for marketing sections
- Generous section padding; vary rhythm between sections
- Avoid nested cards and identical icon-card grids
- No side-stripe accent borders on callouts

## Motion

Marketing site weighting (design-motion-principles): Jakub primary, Jhey secondary, Emil selective.

- Page load: one orchestrated reveal max; respect `prefers-reduced-motion`
- No bounce or elastic easing on UI chrome
- Do not animate layout properties (width, height, margin)
- Card illustrations animate only when active or hovered and rest on a complete still; hero auto-advance stops at first interaction and never runs under reduced motion.

## Components (v1)

- Site header with logo, nav (Home, Services, Case studies, Ad grader, Blog, Contact)
- Footer with About, Privacy, Terms links
- Primary button (brand blue), secondary button (outline slate)
- Service bundle cards on Services page
- Case study index: asymmetric `.case-study-list` rows (not identical card grid)
- Case study detail: prose body from content collection
- Scope-led engagement tiers on the legacy `/pricing` page; no public MaaxGen fees
- Ad account grader as the primary global acquisition CTA
- Contact form placeholder (name, email, message)
- Service Studio hero (`#studio`): three views (stack, focus, grid), toolbar with search and category filters, and a bottom dock
- Service cards: solid surfaces, blue accent, each with its own illustration (`ServiceVisual.astro`); no glass effects
- Shortlist pill: floating site-wide pill showing interested services
- Plan dialog: "Get my plan" form for name, email, business type, and the shortlist
