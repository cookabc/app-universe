# Stock Platform

A modern stock trading platform built with Next.js 16, React 19, TypeScript 5, and Tailwind CSS.

## Features

- **TradingView Charting Library** integration with UDF data feed
- **Real-time stock quotes** via Yahoo Finance API (with mock data fallback for development)
- **Portfolio watchlist** with tree-structured groups
- **Market indices** tracking (Dow Jones, NASDAQ, S&P 500)
- **Dark theme UI** optimized for trading
- **Responsive layout** with resizable panels

## Tech Stack

- Next.js 16.2.4
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- TradingView Charting Library

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Lint
bun run lint
```

## Mock Data

In development mode, mock data is enabled by default to avoid Yahoo Finance API rate limiting. Click the "Mock Data" indicator in the top-right corner to toggle between mock and real data.

## Branch Model

Use `main` as the single deployable branch. Small changes can land directly on `main`; larger or risky work can use a short-lived `codex/<topic>` branch and merge back into `main` when ready. Delete topic branches after merge so the branch list stays boring.

The default finish step for this project is: commit the current change, push `main`, then deploy.

```bash
git status
git add .
git commit -m "Describe the change"
git push origin main
```

## Deployment

This project is configured for deployment on Vercel. Deployments should come from the latest pushed `main`.

```bash
# Deploy to Vercel
bun run deploy
```

## License

MIT
