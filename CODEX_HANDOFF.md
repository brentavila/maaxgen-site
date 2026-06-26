# Codex handoff — MaaxGen site (v1)

Copy the prompt below into the Codex IDE panel. Attach the `@` files listed.

---

## Prompt (copy from here)

```text
@AGENTS.md @PRODUCT.md @DESIGN.md @motion-audits/homepage-audit.md
@CODEX_HANDOFF.md
@src/pages/services.astro @src/pages/case-studies/index.astro @src/pages/case-studies/[slug].astro
@src/pages/index.astro @src/styles/global.css
@.cursor/skills/maaxgen-stack/SKILL.md

Context: Cursor + Impeccable scaffolded an Astro 6 marketing site for MaaxGen. Extend what exists — do NOT re-scaffold or switch frameworks.

## Already done (refine, do not rewrite from scratch)
- Home (/), Services (/services) — layout quality references
- Case studies: index + dynamic detail + 2 placeholder entries in src/content/case-studies/
- Header/footer with Case studies in nav
- global.css utilities, motion rules, logo at public/brand/logo-lockup.png

## Motion (strict)
- Reveal: 0.45s cubic-bezier(0.25, 1, 0.5, 1) ease-out; max 2 `.reveal-delay-*` classes per page
- Honor prefers-reduced-motion (see global.css)
- NO Framer Motion; NO animating width/height/margin/grid

## Build next (priority)
1. **Case studies** — Polish index + detail templates; improve placeholder MDX/markdown stories; add optional home section linking to /case-studies; ensure asymmetric layouts (case-study-list), not icon card grids
2. **Pricing** — Align tier names with services bundles; add comparison detail; CTAs
3. **About** — Agency story, trust, local + e-commerce
4. **Blog** — content collection + index listing (+ optional sample post)
5. **Contact** — Improve layout/copy; keep form as placeholder unless told otherwise
6. **Privacy / Terms** — Expand placeholders (mark “review with counsel”)

## Design rules
- Read PRODUCT.md Case studies (v1) section — required scope
- Reuse classes: .page-hero, .eyebrow, .pillar-list, .capability-list, .split-block, .case-study-list, .cta-row, .section--surface
- Anti-references in PRODUCT.md: no Inter, purple gradients, identical icon-card grids, hero big-number stats
- Extend global.css only when needed

## Verification
- Run `npm run build` and fix all errors
- List files changed and any assumptions in the summary
```

---

## Contact form (pick one before Codex runs)

Uncomment one line in the prompt above or tell Codex in a follow-up:

- `Contact: placeholder form only (no backend)`
- `Contact: integrate Formspree at [your form URL]`
- `Contact: Netlify Forms`

---

## What changed for Case studies v1

- PRODUCT.md — full site map + case study requirements
- Nav — Case studies between Services and Pricing
- Routes — `/case-studies`, `/case-studies/[slug]`
- Content — `src/content/case-studies/` (2 samples)

Replace placeholder client stories before public launch.
