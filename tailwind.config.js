/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--accent)",
        secondary: "var(--text-secondary)",
        background: "var(--bg-primary)",
        card: "var(--bg-card)",
        border: "var(--border)",
        input: "var(--bg-secondary)",
        ring: "var(--glow)",
        foreground: "var(--text-primary)",
        muted: {
          foreground: "var(--text-muted)",
          background: "var(--bg-secondary)",
        },
        accent: {
          foreground: "var(--white)",
          background: "var(--accent)",
        },
        destructive: {
          foreground: "var(--white)",
          background: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  plugins: [],
}