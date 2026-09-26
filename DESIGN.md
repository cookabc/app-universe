# App Universe — Working Atlas

**Status:** describes the implementation in `src/` on 25 Sep 2026.

## Thesis

The site is a selective field guide for useful digital tools. The value is the curator's judgement: when a tool earns a place, what it replaces, and what to watch out for. The new visual language makes the archive feel researched and edited, while search, tags, external links and readable notes remain straightforward.

## Visual identity

- **Observation desk:** deep ink-blue (`#10232E`) for the entry experience, with a quiet coordinate grid and two orbit lines. The motif suggests mapping; there are no literal planet illustrations.
- **Working paper:** warm off-white (`hsl(45 25% 94%)`) and ivory cards (`hsl(45 40% 98%)`) for browsing. The dark theme uses the same hierarchy with darker paper surfaces.
- **Signals:** coral (`#FC8867`) marks editorial emphasis; pale mint (`#C0ED9D`) identifies the primary action. Preview images provide the rest of the variety.
- **Type:** Georgia/Songti SC for headlines, tool names and curator notes; IBM Plex Sans for controls and descriptions; IBM Plex Mono for indexes and metadata. Long notes use generous leading.
- **Shape:** 18–22px rounded archive frames, hairline borders and soft depth. This replaces the prior 2px black borders and offset shadows.

## Screens

### Home

The hero is a two-part editorial spread. Left: product judgement, a clear archive action and three factual archive counts. Right: one primary tool preview with two smaller leads. Three eager previews are sufficient for the first screen; the full catalog loads below. The coral index strip closes the hero.

Below it, discovery controls stay visible and usable: search, tag filters, curated order and reproducible shuffle. Four featured records set the editorial pace, followed by the complete category index. The full archive retains all 29 tools, including those featured above; the featured section is an introduction rather than an alternative source of truth.

### Tool detail

The title and curator judgement read like an article. The preview and external action sit beside them on desktop and below them on mobile. Copy-note, copy-image, tag navigation, GitHub and related-tool links remain exposed. The note has one coral rule and a typographic quotation mark instead of a sticker.

## Interaction rules

- Every primary action is visible without hover. The search field and 44px controls remain keyboard and touch reachable.
- Hover elevation is subtle; `prefers-reduced-motion` removes decorative transforms.
- English/Chinese switching updates visible copy and document language. Theme switching preserves readable contrast in both modes.
- Tool previews use `next/image`, responsive sizes and an icon fallback. The hero loads three previews eagerly; archive images load lazily.
- Archive metadata avoids an unverified “last updated” date. The site does not claim tool prices, rankings or usage numbers it cannot substantiate.

## Technical boundaries

`src/data/tools.ts` is the catalog. No visual can invent a product or remove its curator caveat. The page routes, structured data, Markdown negotiation and machine-readable catalog are part of the product and remain functional. The privacy and terms pages use the same palette but a narrower reading measure.

## Acceptance

Review desktop, 390px mobile and dark mode, plus one tool detail page. Verify search, tag selection, shuffle link, language switch, theme switch and internal/external links. Run `pnpm check`. This is the stopping bar for the implementation; a later public-site performance review can inspect production caching and live external links.
