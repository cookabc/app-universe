# App Universe

A curated directory of useful tools and resources, built with Next.js App Router.

**Live:** https://app-universe.vercel.app

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16, [React](https://react.dev/) 19, [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 (CSS-first `@theme` in `src/app/globals.css`), `clsx`, `tailwind-merge`
- **UI**: [Radix UI](https://www.radix-ui.com/) primitives, shadcn-style components in `src/components/ui`
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **i18n**: [i18next](https://www.i18next.com/) with `react-i18next` and browser language detection (EN / 中文)
- **Theming**: `next-themes` for light/dark/system mode
- **Tooling**: [Biome](https://biomejs.dev/) for linting and formatting

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server on port 4000
pnpm dev

# Build for production
pnpm build

# Start the production server
pnpm start
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start the development server on port 4000 |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server |
| `pnpm test` | Run Node.js native tests |
| `pnpm lint` | Run Biome checks |
| `pnpm lint:fix` | Run Biome checks and apply safe fixes |
| `pnpm format` | Format code with Biome |
| `pnpm format:check` | Check formatting with Biome |
| `pnpm typecheck` | Run TypeScript without emitting files |
| `pnpm check` | Run lint, typecheck, build, and tests |
| `pnpm download-previews` | Download tool preview images (maintenance) |

## Project Structure

```
app-universe/
├── PROJECT_OVERVIEW.md   # Product content, positioning, and boundaries
├── DESIGN.md             # Signal Atlas visual and interaction system
├── src/
│   ├── app/              # Next.js App Router (pages, metadata, robots, sitemap)
│   ├── components/       # React components (ui, layout, features)
│   ├── data/             # Static data (tools.ts, tests)
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities, site config, icon mapping
├── public/
│   ├── locales/          # i18n translation files (en, zh)
│   └── previews/         # Tool preview images ({tool.id}.png)
├── scripts/
│   └── download-previews.js
├── biome.json
├── next.config.ts
├── package.json
├── pnpm-workspace.yaml
├── postcss.config.mjs
└── tsconfig.json
```

## Data

Tools are defined in `src/data/tools.ts`. Preview images live in `public/previews/` and **must** match each tool's `id` (e.g. `open-design` → `public/previews/open-design.png`).

Each tool also has a static detail page at `/t/{id}` (e.g. `/t/namethatui`) with curator note, tags, related tools, and SEO metadata. The home wall links there; external **Visit** still opens the tool site.

Canonical site URL for SEO metadata is `src/lib/site.ts`.

## License

See [LICENSE](./LICENSE).
