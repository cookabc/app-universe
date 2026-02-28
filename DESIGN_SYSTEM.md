# Universal Design System (App Universe)

This document outlines the core design principles, tokens, and utility classes for the App Universe project. All new components and pages should adhere to these guidelines to maintain a cohesive, futuristic, and professional SaaS aesthetic.

## 1. Core Philosophy

*   **Aesthetic**: Futuristic, High-Tech, Professional SaaS.
*   **Modes**: Fully responsive Dark & Light modes.
*   **Key Elements**: Glassmorphism (`backdrop-blur`, semi-transparent surfaces), Gradient Glows, and sharp high-contrast typography.

## 2. Design Tokens

### Colors

*   **Primary**: Indigo/Violet Gradient
    *   Base: `hsl(250 95% 64%)` (Indigo 500 equivalent)
    *   Gradient: `bg-gradient-to-r from-primary to-purple-600`
*   **Background**:
    *   **Light Mode**: Soft Off-White (`hsl(210 40% 98%)`)
    *   **Dark Mode**: Deep Slate/Charcoal (`hsl(222 47% 11%)`)
*   **Text**:
    *   **Foreground**: High contrast (`hsl(222 84% 4.9%)` / `hsl(210 40% 98%)`)
    *   **Muted**: Lower contrast for secondary text (`hsl(215.4 16.3% 46.9%)` / `hsl(215 20.2% 65.1%)`)

### Typography

*   **Headings**: `Space Grotesk`
    *   Usage: Page titles, section headers, big stats.
    *   Weights: Bold (700), Black (900).
*   **Body**: `Inter`
    *   Usage: Paragraphs, UI labels, button text.
    *   Weights: Regular (400), Medium (500).
*   **Data/Code**: `JetBrains Mono` or `ui-monospace`
    *   Usage: Tickers, code snippets, financial data, countdowns.

### Surfaces & Effects

*   **Glassmorphism**: The signature style of App Universe.
    *   Style: High blur (`backdrop-blur-xl`), low opacity background (`bg-white/5` or `bg-black/5`), subtle border (`border-white/10`).
*   **Cards**: Rounded corners (`rounded-2xl` or `rounded-3xl`) with soft shadows.
*   **Glows**: Subtle background gradients or colored shadows (`shadow-primary/20`) to indicate activity or focus.

## 3. Utility Classes (Tailwind)

These custom utility classes are defined in `src/app/globals.css`.

| Class | Description |
| :--- | :--- |
| `.glass` | Applies standard glassmorphism: blur, semi-transparent bg, subtle border. |
| `.glass-card` | Glass effect specifically optimized for card containers, includes hover states and shadows. |
| `.text-gradient` | Applies the primary brand gradient (Primary -> Purple) to text (`bg-clip-text`). |

## 4. Component Guidelines

### Buttons
*   **Primary**: Rounded-full, Primary color background or Gradient, white text.
    *   *Hover*: Slight lift (`-translate-y-0.5`), increased shadow (`shadow-lg`).
*   **Secondary/Outline**: Transparent background, border matching text/primary.
    *   *Hover*: Subtle background tint (`bg-primary/10`).

### Cards
*   **Structure**: Clean padding (p-6 or p-8), rounded corners (rounded-3xl).
*   **Interaction**: Hover effects including border highlights and glow intensification.

### Inputs
*   **Style**: Transparent background (`bg-white/5` or `bg-black/5`), border-bottom or full border.
*   **Focus**: Ring highlight with Primary color (`ring-primary`).

## 5. Responsive Layouts

*   **Container**: `max-w-7xl mx-auto px-4` for main content areas.
*   **Grids**:
    *   **Desktop**: `grid-cols-3` or `grid-cols-4` for dense data/cards.
    *   **Tablet**: `grid-cols-2`.
    *   **Mobile**: `grid-cols-1`.
*   **Spacing**: Generous usage of whitespace (`gap-6`, `gap-8`, `py-20`) to maintain a clean, "airy" feel.

## 6. Iconography

*   **Library**: `lucide-react`.
*   **Style**: Stroke width `2` or `1.5` for a refined look.
*   **Color**: Often matches text color or uses Primary for accents.

---

*This design system is enforced via `src/app/globals.css` and the Tailwind configuration.*
