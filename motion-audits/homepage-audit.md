# Homepage motion audit

## Reconnaissance

- **Product type:** Static Astro marketing site for MaaxGen (bundled marketing, advertising, and AI for SMBs).
- **Motion personas:** Jakub (primary) — purposeful, restrained polish; Jhey (secondary) — not used on this pass (no playful CSS gimmicks).
- **Surfaces with motion:** Hero `.reveal` stagger, global `prefers-reduced-motion`, button and nav color transitions.

## Findings and changes

| Area | Before | After |
|------|--------|-------|
| Reveal easing | `0.7s ease` | `0.45s cubic-bezier(0.25, 1, 0.5, 1) ease-out` (Jakub polish) |
| Stagger | Two delays (0.1s / 0.2s) | Two delays only (0.08s / 0.16s) — max 2, no third delay |
| Layout animation | None | None (appropriate for static marketing) |
| Reduced motion | Present on `html` and `.reveal` | Verified; unchanged behavior |
| Buttons / nav | Partial transitions | Color/opacity transitions on `.btn` and `.nav a` |

## Gaps

- None critical for a static Astro marketing homepage.
- No Framer Motion or client-heavy animation libraries (by design).

## Notes

- Do not animate layout properties (width, height, grid) on this site.
- Future enhancements: optional micro-hover on capability cards only if `prefers-reduced-motion` is respected.