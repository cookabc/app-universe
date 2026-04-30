# Capability Atlas

A light-first atlas for browsing agent skills and the design resources that make them easier to apply. Search by capability, inspect case-style skill pages, copy update commands, and jump to source links or external design references.

## Features

- **Browse & Search** — Grid view with real-time search across skill name, description, and ID
- **Category Filtering** — Filter skills by category (Design, Dev Tools, Communication, etc.)
- **Skill Detail Pages** — Case-style pages with showcase previews, workflows, outputs, manual content, update commands, and source links
- **Generated Showcases** — Skills without static screenshots still get generated preview boards from their metadata
- **Light-First Theme** — Warm white surfaces, fine borders, restrained accents, and optional dark mode through Tweaks
- **Accessibility** — ARIA roles, focus-visible styles, skip-to-content link, and `prefers-reduced-motion` support

## Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Framework  | React 19 + TypeScript                   |
| Build      | Vite 8                                  |
| Routing    | React Router v7                         |
| State      | React hooks (no external state library) |
| Markdown   | react-markdown + remark-gfm             |
| Runtime    | Bun                                     |
| Linting    | oxlint                                  |
| Formatting | oxfmt                                   |

## Getting Started

### Prerequisites

- Bun 1.3.12+

### Install

```bash
bun install
```

### Development

```bash
bun run dev
```

The app starts at `http://localhost:5173` with hot module replacement.

### Build

```bash
bun run build
```

Outputs to `dist/` for production deployment.

### Check

```bash
bun run check
```

Runs TypeScript, oxlint, and oxfmt in check mode.

### Deploy

```bash
bun run deploy
```

This verifies the project, builds `dist/`, and pushes `main`. GitHub Pages then deploys the latest `main` build through `.github/workflows/deploy.yml`.

For the usual end-of-task flow, use:

```bash
bun run ship
```

That runs the same checks, builds, stages all changes, opens `git commit`, and pushes `main`. The default branch model is intentionally simple: keep production-ready work on `main`, commit at the end of each task, push immediately, and let the deploy workflow publish from `main`. Use temporary feature branches only for risky experiments or long-running work, and delete them after merge.

### Preview Production Build

```bash
bun run preview
```

### Lint

```bash
bun run lint
```

## Project Structure

```
capability-atlas/
├── public/
│   ├── skills-data.json          # Skill metadata (name, category, stats, triggers)
│   ├── resources-data.json       # Featured external design resources
│   ├── skills-assets/            # Per-skill screenshots and images
│   ├── icons.svg                 # Sprite icons
│   ├── logo.svg                  # Header logo
│   └── favicon.svg               # Browser favicon
├── src/
│   ├── components/
│   │   ├── Home/                 # Homepage: hero, search, filter, grid, card
│   │   ├── SkillDetail/          # Detail page: banner, tabs, stats, related skills
│   │   ├── Demos/                # Demo components: code playground, color palette, etc.
│   │   ├── Layout/               # Header, footer, page layout wrapper
│   │   ├── common/               # Shared: MarkdownRenderer
│   │   └── AddSkillDialog.tsx    # Dialog to add skills from GitHub
│   ├── data/
│   │   ├── skills.ts             # Skill data loader & custom skill management
│   │   └── categories.ts         # Category definitions (color, icon, gradient)
│   ├── hooks/
│   │   └── useSkills.ts          # useSkills() + useSearch() hooks
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── SkillDetailPage.tsx
│   ├── utils/                    # Parsing, analysis, file tree builder
│   ├── styles/
│   │   └── global.css            # CSS variables, focus styles, animations
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
└── tsconfig*.json
```

## Skill Data Format

Skills are defined in `public/skills-data.json`. Each skill entry:

```json
{
  "id": "ai-style-copycat",
  "name": "AI Style Copycat",
  "description": "Extract and replicate AI art styles from images...",
  "category": {
    "key": "design",
    "label": "Design",
    "color": "#ec4899",
    "gradient": "linear-gradient(135deg,#ec4899,#f97316)",
    "icon": "🎨"
  },
  "stats": {
    "lineCount": 78,
    "charCount": 3139,
    "sectionCount": 8,
    "codeBlockCount": 4,
    "complexityScore": 2,
    "complexityLabel": "Simple",
    "readTime": "2 min"
  },
  "triggerPhrases": ["Extract and replicate AI art styles"],
  "installCommand": "npx @anthropic/mcp-install ai-style-copycat",
  "content": "# AI Style Copycat\n\n..."
}
```

## Adding a Skill

Add skills directly in `public/skills-data.json`. Keep each page useful as a showcase, not a raw dump of the source `SKILL.md`.

1. Add one `SkillData` entry with a stable `id`, display `name`, concise `description`, `category`, `stats`, `triggerPhrases`, `useCases`, `keyFeatures`, `fileInfo`, `lastUpdated`, `type`, and empty `assets` arrays when no screenshots exist.
2. Add source metadata when available: `skillsShUrl`, `githubUrl`, `websiteUrl`, `sourceUrl`, `installCommand`, and `updateCommand`. For local-only skills, set `localOnly: true` and omit external links.
3. Write `content` as a curated manual for the detail page. Prefer sections like `Best For`, `Workflow`, `Output Shape`, and `Boundaries`. Remove local paths, install noise, duplicated source links, huge templates, and implementation details that do not help someone evaluate the skill.
4. If the skill introduces a new category, update `src/data/categories.ts`. If it uses an existing category, add the id to `MAP` only when useful for parser fallback consistency.
5. Add the id to `SKILL_DISPLAY_ORDER` in `src/hooks/useSkills.ts` so the gallery order stays intentional.
6. Add a custom preview in `src/components/Demos/SkillPreview.tsx` only when the generic generated showcase is not good enough.
7. Run `bun run format`, `bun run check`, and `bun run build`.

When removing a skill, delete its data entry and clean up any dedicated preview, category mapping, ordering entry, and asset folder references.

## Adding a Resource

Resources are external references that improve design judgment, product framing, or prompt quality. Keep them separate from skills: skills are installable or executable capabilities; resources are curated sources that guide how skills are used.

1. Add the entry to `public/resources-data.json` with `id`, `name`, `url`, `kind`, `eyebrow`, `description`, `bestFor`, `tags`, `relatedSkillIds`, `featured`, and `accent`.
2. Use `featured: true` only for resources that should be visibly promoted on the homepage.
3. Set `relatedSkillIds` to control which skill detail pages show the resource in `Related Design Resources`.
4. Keep descriptions short and link out to the original site. Do not copy full external content into this repo.
5. Run `bun run format`, `bun run check`, and `bun run build`.
