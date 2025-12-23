/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5048e5',
          hover: '#4338ca',
          light: '#818cf8',
          dark: '#3730a3'
        },
        background: {
          light: '#f6f6f8',
          dark: '#121121'
        },
        surface: {
          light: '#ffffff',
          dark: '#1e1c30'
        },
        text: {
          main: '#0f0e1b',
          secondary: '#545095',
          muted: '#8b8aa7'
        }
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(80, 72, 229, 0.1)',
        glow: '0 0 15px rgba(80, 72, 229, 0.5)'
      }
    },
  },
  plugins: [],
}
