# Skill Showcase

A web-based gallery for browsing, exploring, and demonstrating Agent Skills. Search, filter by category, view interactive demos, and add new skills directly from GitHub repositories.

## Features

- **Browse & Search** — Grid view with real-time search across skill name, description, and ID
- **Category Filtering** — Filter skills by category (Design, Dev Tools, Communication, etc.)
- **Skill Detail Pages** — Markdown rendering with syntax highlighting, file tree explorer, and trigger phrase clouds
- **Interactive Demos** — Code playgrounds, color palettes, image galleries, and terminal windows
- **Add Skills from GitHub** — Paste a GitHub URL to parse and add new skills to the gallery
- **Dark Theme** — Full dark mode with `color-scheme: dark`
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
skill-showcase/
├── public/
│   ├── skills-data.json          # Skill metadata (name, category, stats, triggers)
│   ├── skills-assets/            # Per-skill screenshots and images
│   ├── icons.svg                 # Sprite icons
│   └── favicon.svg
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

1. Click the **Add Skill** button on the homepage
2. Paste a GitHub repository URL or `owner/repo` format
3. Preview the parsed skill metadata
4. Confirm to add it to the gallery

Custom skills are registered at runtime and persist for the current session.
