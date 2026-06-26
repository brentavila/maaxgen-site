# MaaxGen

## Product Purpose

Marketing site for MaaxGen, a marketing, advertising, and AI agency. Services are sold as a bundled, all-in-one solution for local businesses and e-commerce businesses. The site promotes services and drives inquiries.

## Users

- Local business owners evaluating a single agency partner for growth
- E-commerce operators who need ads, creative, and AI-enabled marketing workflows
- Visitors comparing packages before booking a call or submitting a contact form
- Prospects who need proof of outcomes before trusting a bundled agency offer

## Register

brand

## Tone

Professional, modern, and growth-oriented. Confident without hype. Plain language for SMB owners. Avoid jargon unless it helps clarify the bundle value.

## Strategic Principles

- Lead with the bundle and all-in-one positioning (one partner, not three vendors)
- Speak to both local and e-commerce audiences without splitting the brand
- Every page should support a path to services, pricing, case studies, or contact
- Trust and clarity over flashy effects
- Case studies show real outcomes and scope (marketing + ads + AI), not vanity metrics

## Site map (v1)

| Route | Purpose |
|-------|---------|
| `/` | Home — value prop, bundle positioning, primary CTA |
| `/services` | Bundled capabilities (marketing, advertising, AI) |
| `/case-studies` | Proof — index of client stories |
| `/case-studies/[slug]` | Individual case study detail |
| `/pricing` | Packages / tiers |
| `/contact` | Lead capture |
| `/blog` | Articles (SEO, authority) |
| `/about` | Agency story, trust |
| `/privacy`, `/terms` | Legal |

**Main nav:** Home → Services → Case studies → Pricing → Blog → Contact

## Case studies (v1)

**Goal:** Build trust for SMB owners comparing agencies. Show bundled work, not siloed “design-only” or “ads-only” wins.

**Index page (`/case-studies`):**

- Hero: why outcomes matter for local and e-commerce brands
- Listing: asymmetric rows (not identical icon cards). Each entry: client type, one-line outcome, services tags, link to detail
- CTA to contact or services

**Detail page (`/case-studies/[slug]`):**

- Client context (industry, starting situation)
- Challenge
- What MaaxGen delivered (map to marketing / advertising / AI pillars)
- Results (qualitative OK for v1; use real-sounding placeholders until client approval)
- Optional pull quote
- CTA: Book a call

**Content:** Astro content collection `src/content/case-studies/`. v1 includes 2 sample entries (one local, one e-commerce) as placeholders — replace with approved client stories before launch.

**Layout rules:** Reuse `global.css` patterns from `/services` (`eyebrow`, `split-block`, `pull-quote`, `pillar` metaphors). No hero big-number stat blocks. No identical 3-column card grid of case studies.

## Anti-references

Generic AI-agency aesthetic: purple gradients on white, Inter as the default font, identical icon-plus-heading feature card grids, hero big-number stat blocks, glassmorphism cards, gradient text. Anything that reads as a template rather than MaaxGen.

## CTAs

- Primary: Book a call, Get started
- Secondary: View services, See pricing, View case studies
