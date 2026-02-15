# Copilot Instructions for Real-time Fund

## Project Overview

A pure frontend real-time fund valuation and holdings tracker built with Next.js 14, using a **Neumorphism** design system (light theme, soft shadows, orange accents) and mobile-responsive layout. The app runs entirely client-side without a backend server, making it deployable to static hosting platforms like GitHub Pages.

**Live Preview**: https://hzm0321.github.io/real-time-fund/

## Build Commands

```bash
# Development
npm run dev         # Start dev server at localhost:3000

# Production
npm run build       # Static export to ./out directory
npm start          # Start production server (not used for static deployment)
```

**Note**: No test or lint commands are configured in this project.

## Architecture

### Data Fetching Pattern (JSONP + Script Injection)

The app bypasses CORS by using JSONP and dynamic script tag injection to fetch data from public APIs:

1. **Fund Valuation** (`fetchFundData` in page.jsx ~line 2019)
   - Primary: Eastmoney JSONP endpoint (`fundgz.1234567.com.cn`) via `window.jsonpgz` callback
   - Fallback: Tencent Finance (`qt.gtimg.cn`) for confirmed NAV and gain/loss percentage
   - Combines both sources, preferring Tencent data when more recent

2. **Holdings Data** (~line 2084)
   - Scrapes top 10 holdings from Eastmoney HTML response via `window.apidata`
   - Parses `<tr>` rows to extract stock codes, names, and weights
   - Then fetches real-time stock prices from Tencent Finance for each holding

3. **Fund Search** (~line 2169)
   - Uses JSONP with dynamic callback names to prevent conflicts
   - Filters results to show only public funds (CATEGORY === 700)

**Key Implementation Details**:
- All JSONP callbacks use unique names (timestamps + random strings) to prevent concurrent request collisions
- Scripts are dynamically created, attached to `document.body`, then removed after loading
- Tencent Finance stock codes require prefixes: `sh` (Shanghai), `sz` (Shenzhen), `bj` (Beijing) based on first digit

### State Management

- **localStorage**: Persists fund list, favorites, groups, and settings
- **React State**: All UI state is in the main `page.jsx` component (~3500 lines)
- No external state management library

### Component Structure

- `app/page.jsx`: Single-file app containing all components (icons, modals, cards, main logic)
- `app/components/Announcement.jsx`: Announcement banner component
- `app/globals.css`: Global styles with CSS custom properties for Neumorphism theme (`--bg`, `--shadow-light`, `--shadow-dark` for soft shadow effects)
- `app/layout.jsx`: Root layout with metadata

### Key Features

- **Reorderable Cards**: Uses `framer-motion`'s `<Reorder.Group>` for drag-and-drop
- **Auto-refresh**: Configurable interval (5-300 seconds) using `setInterval`
- **Grouping System**: Custom groups with drag-to-reorder and inline rename
- **Holdings**: Expandable/collapsible view of top 10 holdings with live tracking
- **Holdings Contribution**: Visual bar chart showing which stocks drive today's fund movement
- **NAV Sparkline**: 30-day historical NAV mini chart on each fund card
- **Market Overview Bar**: Real-time Shanghai/Shenzhen/ChiNext index display
- **Responsive**: Mobile-first design with conditional rendering based on viewport

## Key Conventions

### JSONP Callback Naming
Always use unique callback names to avoid race conditions:
```javascript
const callbackName = `jsonpgz_${code}_${Math.random().toString(36).slice(2, 7)}`;
```

### Stock Code Prefix Logic
Tencent Finance requires market-specific prefixes:
```javascript
const getTencentPrefix = (code) => {
  if (code.startsWith('6') || code.startsWith('9')) return 'sh';  // Shanghai
  if (code.startsWith('0') || code.startsWith('3')) return 'sz';  // Shenzhen
  if (code.startsWith('4') || code.startsWith('8')) return 'bj';  // Beijing
  return 'sz';
};
```

### Script Loading Pattern
All external data fetching follows this pattern:
```javascript
const script = document.createElement('script');
script.src = url;
script.onload = () => {
  // Extract data from window globals
  document.body.removeChild(script);
};
document.body.appendChild(script);
```

### localStorage Keys
- `fundCodes`: Array of fund codes
- `favorites`: Array of favorite fund codes
- `groups`: Array of custom group objects
- `refreshInterval`: Auto-refresh interval in seconds

## Deployment

GitHub Actions workflow (`.github/workflows/*.yml`) automatically builds and deploys to GitHub Pages on push to `main` branch. The Next.js static export is used (`next build` with output: 'export' config).

## Dependencies

- **next**: 14.2.5 (App Router with static export)
- **react**: 18.3.1
- **framer-motion**: 12.29.2 (animations and drag-and-drop)

## Data Sources

All financial APIs are public (no authentication required) and use JSONP/script injection to bypass CORS.

### Eastmoney (东方财富/天天基金) - Fund Data

| Endpoint | URL | Method | Returns |
|----------|-----|--------|---------|
| Fund Valuation | `https://fundgz.1234567.com.cn/js/{code}.js` | JSONP (`window.jsonpgz`) | Estimated NAV, valuation time, growth rate |
| Fund Search | `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key={term}&callback={cb}` | JSONP (dynamic callback) | Fund list filtered by CATEGORY === 700 |
| Fund Holdings | `https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code={code}&topline=10` | Script injection | Top 10 holdings HTML via `window.apidata.content` |

### Tencent Finance (腾讯财经) - Stock & Fund Quotes

| Endpoint | URL | Method | Returns |
|----------|-----|--------|---------|
| Fund Confirmed NAV | `https://qt.gtimg.cn/q=jj{code}` | Script injection | Confirmed NAV, gain/loss %, NAV date via `window.v_jj{code}` |
| Stock Quotes | `https://qt.gtimg.cn/q=s_{prefix}{code}` | Script injection | Real-time price change via `window.v_s_{prefix}{code}` |
| Trading Day Check | `https://qt.gtimg.cn/q=sh000001` | Script injection | Shanghai index timestamp via `window.v_sh000001` |
| Market Indices | `https://qt.gtimg.cn/q=s_sh000001,s_sz399001,s_sz399006` | Script injection | Batch index quotes (Shanghai, Shenzhen, ChiNext) |

Stock code prefixes: `sh` (codes starting 6/9), `sz` (codes starting 0/3), `bj` (codes starting 4/8).

Tencent data format: tilde-separated (`~`) values. Key fields vary by query type (e.g., `p[5]` = NAV, `p[7]` = gain/loss %).

| Fund Historical NAV | `https://fund.eastmoney.com/pingzhongdata/{code}.js` | Script injection | Full NAV history via `window.Data_netWorthTrend` (array of `{x: timestamp, y: nav, equityReturn: %}`) |

### Third-party Services

| Service | URL | Method | Purpose |
|---------|-----|--------|---------|
| Web3Forms | `https://api.web3forms.com/submit` | POST (fetch) | User feedback submission |
| Google Analytics | `https://www.googletagmanager.com/gtag/js` | Next.js Script | Web analytics (ID: `G-PD2JWJHVEM`) |

### Additional Available APIs (not yet used in the app)

| Endpoint | URL | Returns |
|----------|-----|---------|
| Fund Historical NAV | `https://api.fund.eastmoney.com/f10/lsjz?callback={cb}&fundCode={code}&pageIndex=1&pageSize={n}&startDate={date}&endDate={date}` (requires `Referer: https://fundf10.eastmoney.com/`) | Historical NAV list with dates, daily change %, subscription/redemption status |
| Stock K-line | `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param={prefix}{code},day,,,{count},qfq` | Daily OHLCV data (open, close, high, low, volume) |
| Stock Minute Data | `https://web.ifzq.gtimg.cn/appstock/app/minute/query?code={prefix}{code}` | Intraday minute-by-minute price and volume |
| Market Indices | `https://qt.gtimg.cn/q=s_sh000001,s_sz399001,s_sz399006` | Shanghai Composite, Shenzhen Component, ChiNext in one call |

### Data Flow

1. Fetch estimated NAV from Eastmoney JSONP
2. In parallel: fetch confirmed NAV from Tencent + fetch holdings from Eastmoney
3. For each holding: fetch real-time stock quote from Tencent
4. Merge results, preferring Tencent data when more recent

## License

AGPL-3.0 - Network use requires source code disclosure
