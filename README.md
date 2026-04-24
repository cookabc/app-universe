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
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Mock Data

In development mode, mock data is enabled by default to avoid Yahoo Finance API rate limiting. Click the "Mock Data" indicator in the top-right corner to toggle between mock and real data.

## Deployment

This project is configured for deployment on Vercel.

```bash
# Deploy to Vercel
vercel --prod
```

## License

MIT
