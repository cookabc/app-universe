# Gemini Code Assistant Context

## Project Overview

This is a Next.js 15 project that serves as a collection of various web applications. It utilizes the App Router, React 19, and is styled with Tailwind CSS v4. The project integrates with OpenAI for AI-powered features and uses shadcn/ui for UI components. It's a showcase of modern web development practices and a playground for building and testing new ideas.

The project is structured as a monorepo-style collection of smaller apps, each with its own route within the main application. These apps range from a typing practice tool to a prompt engineering playground, an AGI school, and more.

## Building and Running

To get the project up and running, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
    (You can also use `yarn`, `pnpm`, or `bun`)

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

4.  **Start the production server:**
    ```bash
    npm run start
    ```

5.  **Lint the code:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Formatting:** The project uses Biome for code formatting. Configuration can be found in `biome.json`.
*   **Styling:** Styling is done with Tailwind CSS v4. The main stylesheet is located at `src/app/globals.css`.
*   **UI Components:** The project uses shadcn/ui components, which are based on Radix UI. Custom components are located in `src/components`.
*   **Module Aliases:** The project uses module aliases for cleaner imports. The `@/*` alias maps to the `src/*` directory.
*   **Server-Side Logic:** Backend logic is handled using Next.js Server Actions, which can be found in files like `src/app/actions.ts`.
*   **AI Integration:** The project uses the `ai` and `@ai-sdk/openai` packages to interact with the OpenAI API. Environment variables for the API key need to be set up in a `.env.local` file.
