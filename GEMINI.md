# Project Context for AI Assistant (GEMINI.md)

## Project Overview

This is a Next.js 15 (App Router) and React 19 application collection called "App Universe". It's designed to host multiple small applications within a single codebase. The project emphasizes modern web development practices, including Server Components, Suspense for streaming, and integration with AI capabilities via the Vercel AI SDK.

Key technologies and features include:
- **Framework**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4 (using the PostCSS plugin), `clsx` and `tailwind-merge` for utility class management, CSS variables for theming.
- **UI Components**: Radix UI primitives and custom shadcn-style components located in `src/components/ui`.
- **AI Integration**: OpenAI integration using `@ai-sdk/openai` and `ai` packages, with Server Actions defined in `src/app/actions.ts` for generating text, streaming conversations, and managing caching/revalidation.
- **Optimizations**: Built-in error boundaries, performance monitoring, and streaming loaders for progressive UI enhancement.
- **Module Aliases**: Uses `@/*` alias for `src/*` as defined in `tsconfig.json` and `components.json`.

## Building and Running

The project uses standard npm scripts for development and building. It is configured to use Next.js's built-in tooling.

- **Install Dependencies**:
  ```bash
  npm install
  # or
  yarn
  # or
  pnpm install
  # or
  bun install
  ```
- **Development Server**:
  ```bash
  npm run dev
  ```
  Starts the development server, typically on `http://localhost:3000`.
- **Production Build**:
  ```bash
  npm run build
  ```
  Creates an optimized production build.
- **Start Production Server**:
  ```bash
  npm run start
  ```
  Starts the production server to serve the built application.
- **Linting/Formatting**:
  ```bash
  npm run lint
  ```
  Uses Biome for formatting and basic linting checks.

## Development Conventions

- **Code Style**: Formatting is managed by Biome, as configured in `biome.json`. This includes rules for JavaScript/TypeScript (single quotes, trailing commas, etc.) and JSON.
- **Component Structure**: UI components follow a shadcn-inspired pattern, using `class-variance-authority` (`cva`) for defining variants and `clsx`/`tailwind-merge` (`cn`) for combining class names.
- **Routing**: Uses the Next.js App Router. New pages are created by adding a `page.tsx` file within a directory under `src/app/`.
- **Server Actions**: Defined in `src/app/actions.ts`. These are asynchronous functions that run on the server and can be called from client components using the `use server` directive.
- **Data Fetching & Caching**: Leverages Next.js's `fetch` with caching options (`next: { revalidate, tags }`) and `unstable_cache` for more complex caching scenarios. Revalidation is managed via `revalidateTag`.
- **Naming Conventions**: Prefers clear and readable variable/function names. Components and functions are kept small and focused.
- **Performance Monitoring**: Includes a custom `PerformanceMonitor` component for tracking metrics in development.