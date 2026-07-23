# Signal Atlas — App Universe Design System

## North Star

**Curated signal, not infinite noise.**

App Universe should feel like a contemporary field guide for useful tools: precise, opinionated, highly scannable, and alive with small moments of discovery. The “universe” idea is expressed through mapping, coordinates, indexes, signal markers, and relationships—not literal planets or decorative space art.

The product remains a personal, bilingual curation archive. Its visual system must make the curator's judgment more visible without obscuring search, filtering, tool details, or external actions.

## Brand Character

- Confident, curious, selective, and human.
- Editorial rather than corporate.
- Technical without looking like a developer dashboard.
- Playful through composition and small accents, not decoration.
- Avoid generic SaaS gradients, glassmorphism, oversized empty heroes, literal constellations, and app-store chrome.

## Color

### Light mode

- Background / cloud: `#F4F3EF`
- Surface / paper: `#FFFFFF`
- Ink: `#101114`
- Muted ink: `#62636A`
- Hairline: `#CBCAC4`
- Primary / electric cobalt: `#315CFF`
- Selected and featured / acid chartreuse: `#D8FF4F`
- Editorial annotation / signal coral: `#FF6B57`

### Dark mode

- Background: `#0C0E13`
- Surface: `#141720`
- Raised surface: `#1C202B`
- Ink: `#F4F3EF`
- Muted ink: `#A6A7AE`
- Hairline: `#343844`
- Primary: `#7E9AFF`
- Selected and featured: `#D8FF4F`
- Editorial annotation: `#FF7D6B`

Use color functionally and sparingly. Tool preview imagery provides most of the visual variety. Cobalt identifies primary actions and links; chartreuse marks active filters and featured records; coral is reserved for editorial annotations.

## Typography

- Display and headlines: **Plus Jakarta Sans**, weight 700–800, tight tracking, compact line height.
- Body: **IBM Plex Sans**, weight 400–600, readable at 15–18px.
- Labels and metadata: **IBM Plex Mono**, uppercase, 11–12px, 0.08–0.12em letter spacing.
- Chinese text should use the platform sans fallback and preserve comparable weight and rhythm.
- Keep hero copy concise. Do not use large type as a substitute for product content.

## Layout

- Desktop: asymmetric 12-column editorial grid, maximum width 1280px.
- Tablet: 6-column grid with simplified spans.
- Mobile: single-column flow with 20px page gutters.
- Major vertical rhythm: 80–112px desktop, 56–72px mobile.
- General component gap: 16–24px.
- Reading width: 640–720px.

The home hero places the value proposition on the left and a compact live archive index on the right. Search, tag filtering, and sort controls form one persistent discovery rail below the hero. Featured tools use disciplined asymmetric spans; the full archive uses a regular grid.

## Shape and Elevation

- Primary containers: 2px ink border, 4px radius.
- Secondary dividers: 1px hairline.
- Cards and inputs should feel crisp and physical.
- Default elevation: none.
- Hover elevation: translate `-2px -2px` with a crisp `3px 3px 0` ink shadow.
- No ambient shadows, floating glass, or excessive pills.

## Components

### Header

- Compact sticky bar with the signal mark, brand, language switch, and theme switch.
- Opaque surface with a clear bottom border; no blur dependency.
- On narrow screens keep the brand and essential controls only.

### Hero

- Product-specific headline: discover tools that earn a place in real work.
- Short supporting statement about human curation and honest caveats.
- Archive metrics appear as an index, not dashboard KPI cards.
- A direct action moves focus to the discovery controls.

### Discovery rail

- Search is the dominant control and resembles a command field.
- Tags are compact rectangular chips; active state uses chartreuse with ink text.
- Curated and shuffle modes remain visible and keyboard accessible.
- Controls may wrap on mobile and must keep 44px touch targets.

### Tool cards

- Preview image leads, followed by name, domain, concise utility, curator note, and tags.
- Featured cards use chartreuse index tabs and stronger layout spans, not decorative copy.
- External visit and internal detail actions are visually distinct.
- Tool metadata stays compact; the curator note gets editorial emphasis.
- Image failure continues to use the tool icon and color fallback.

### Tool detail

- Use a split editorial layout: identity and curator note on one side, preview and actions on the other.
- Keep tags, external site, GitHub, related tools, SEO data, and structured data.
- Related tools use compact cards consistent with the home archive.

### Footer and legal pages

- Footer behaves like an archive colophon with update date, entry count, and legal navigation.
- Legal pages retain a calm, narrow reading measure.

## Interaction and Motion

- Motion duration: 150–220ms.
- Use small translation, underline, border, and color changes only.
- Respect `prefers-reduced-motion` everywhere.
- Focus rings must remain visible against every surface.
- Minimum target size: 44×44px.
- Never make hover the only way to reveal a primary action.

## Content Rules

- Preserve Chinese and English names, descriptions, curator notes, tags, and controls.
- The curator note keeps the structure: when to use it, what it replaces, and a caveat.
- Do not add fake testimonials, user counts, rankings, ratings, prices, or AI-generated product claims.
- Use real tools and preview images from the project data in all prototypes and implementation.

## Responsive Rules

- No fixed-width desktop composition may cause horizontal scrolling.
- Featured spans collapse to one column below tablet width.
- Search and tags remain usable without hiding key filters behind hover.
- Large headlines use `clamp()` and avoid single-word orphan lines.
- Detail actions remain reachable near the tool summary on mobile.

## Accessibility

- Maintain semantic headings, landmarks, labels, and `aria-live` result counts.
- Preserve the skip link and keyboard focus management.
- Maintain WCAG AA contrast for text and interactive states.
- Preview images have localized alt text; decorative related previews may remain empty-alt.
- Language changes update the document language.

## Stitch Source

- Project: `4387277209010447410` — App Universe — Curated Tool Archive Redesign
- Design system: `b30408c345d44c368a6772cdcb92bc69` — Signal Atlas
- Desktop home: `51fe713d503342db999201e3c951ae53`
- Mobile home: `462450cf2c464b9cb73ace76fabc6bed`
- Desktop tool detail: `6d775eae37f84067b44db709c6a43969`

The Stitch outputs are direction and layout references. Repository content, routes, controls, and product boundaries remain the implementation source of truth.
