**English** · [简体中文](README.zh-CN.md)

# Wayseeker

A bilingual (English / 中文) field guide to design, code and creative tools, organised by the work you are actually doing. Next.js 16 App Router + React 19 + Tailwind v4. All tool facts and curator notes live in `src/data/tools.ts`; the task paths live in `src/data/workflow.ts`.

Wayseeker does not stack tool cards by popularity or tag. It follows one route — find direction → establish a visual language → set the interface in motion → study real products → finish and ship — and updates the real preview and the "when to use it, what it replaces, what to watch for" note inside the same scene. Index search, detail pages and a shareable random path are kept.

<p align="center">
  <img src="docs/images/home.png" width="880" alt="Wayseeker workflow explorer: task route, real tool previews, and curator judgement">
</p>

The site opens in English with a header switch to Chinese; the choice persists per
visitor. Strings live in `public/locales/{en,zh}/common.json`.

Production runs at [wayseeker.vercel.app](https://wayseeker.vercel.app). The canonical origin is configured in `src/lib/site.ts` and must match where the site is actually deployed.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Dev server on port 4000 |
| `pnpm build` | Production build |
| `pnpm start` | Production server (`next start`, default port 3000) |
| `pnpm check` | Full gate: biome → tsc → build → node:test, identical to CI |
| `pnpm lint:fix` | Biome autofix |
| `pnpm typecheck` | `tsc --noEmit` |

Tests use Node's built-in runner (`node --experimental-strip-types --test`), colocated with the code they cover. A workflow contract test asserts every tool belongs to exactly one route.

## Style layers

Five stylesheets, imported in this order by `src/app/layout.tsx`:

| File | Responsibility |
| --- | --- |
| `src/app/globals.css` | Tailwind base, colour tokens, type scale, detail-page archive look |
| `src/wayseeker.css` | Workbench layout and the felt material (`--way-felt-*`) |
| `src/wayseeker-themes.css` | Complete light and dark colour token sets |
| `src/wayseeker-chrome.css` | Header and footer typography and hairlines |
| `src/atlas.css` | The tool scene: orbit layout, flip faces, neighbour thumbnails |

The felt surface, the type system and the single accent are documented in [DESIGN.md](DESIGN.md) — that file is the source of truth for the visual system.

## Docs

Every document exists in English first, with a Chinese edition beside it.

| English | 中文 | What it covers |
| --- | --- | --- |
| [DESIGN.md](DESIGN.md) | [DESIGN.zh-CN.md](DESIGN.zh-CN.md) | Visual system: colour, type, layout, components |
| [PRODUCT.md](PRODUCT.md) | [PRODUCT.zh-CN.md](PRODUCT.zh-CN.md) | Users, positioning, principles, accessibility |

## Preview pipeline

Tool previews live in `public/previews/{id}.png`:

- `pnpm download-previews` — screenshot each tool's site, then hand off to optimisation.
- `pnpm optimize-previews` — sharp re-encode in place (1600px long edge + palette PNG). It re-encodes **every** preview, so restore the others first when committing only one new image.

## Adding a tool

1. Add a record to `src/data/tools.ts` (minimum lengths for the en/zh description are enforced by tests).
2. Place it on exactly one route in `src/data/workflow.ts`.
3. Drop the preview at `public/previews/{id}.png`.
4. Commit once `pnpm check` is green.

## Environment

- Node: pinned to `24` by `.nvmrc`; CI uses the same version.
- Package manager: pinned by the `packageManager` field in `package.json`. A local pnpm that differs will self-switch; in a fully tunneled or offline environment that signature check can fail — run `biome` / `tsc` / `next` straight from `node_modules/.bin/` and call node by its nvm absolute path for tests.

## License

MIT, see [LICENSE](LICENSE).
