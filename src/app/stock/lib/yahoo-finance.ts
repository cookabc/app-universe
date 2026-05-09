const YF_BASE = "https://query1.finance.yahoo.com";

// Simple in-memory cache to avoid rate limiting
const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Common headers to mimic browser request
function getYFHeaders() {
  return {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: "https://finance.yahoo.com",
    Origin: "https://finance.yahoo.com",
    Connection: "keep-alive",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "Cache-Control": "no-cache",
  };
}

async function fetchYF(url: string) {
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    const response = await fetch(url, {
      headers: getYFHeaders(),
    });
    if (!response.ok) throw new Error(`YF API error: ${response.status}`);
    const data = await response.json();
    cache.set(url, { data, expires: Date.now() + CACHE_TTL });
    return data;
  } catch (error) {
    console.error(`fetchYF error for ${url}:`, error);
    return null;
  }
}

export interface Quote {
  symbol: string;
  latestPrice: number;
  prevClose: number;
  change: number;
  changePercent: number;
  trend: "up" | "down";
  marketCap?: number;
  volume?: number;
  pe?: number;
  eps?: number;
  high?: number;
  low?: number;
  open?: number;
}

export async function getQuote(
  symbols: string[],
): Promise<Record<string, Quote>> {
  if (!symbols.length) return {};

  const result = await fetchYF(
    `${YF_BASE}/v7/finance/quote?symbols=${symbols.join(",")}`,
  );
  const quotes = result?.quoteResponse?.result || [];

  const quoteMap: Record<string, Quote> = {};

  for (const q of quotes) {
    const latestPrice = q.regularMarketPrice || 0;
    const prevClose = q.regularMarketPreviousClose || 0;
    const change = latestPrice - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;

    quoteMap[q.symbol] = {
      symbol: q.symbol,
      latestPrice,
      prevClose,
      change,
      changePercent,
      trend: changePercent >= 0 ? ("up" as const) : ("down" as const),
      marketCap: q.marketCap || undefined,
      volume: q.regularMarketVolume || undefined,
      pe: q.trailingPE || undefined,
      eps: q.trailingEps || undefined,
      high: q.regularMarketDayHigh || undefined,
      low: q.regularMarketDayLow || undefined,
      open: q.regularMarketOpen || undefined,
    };
  }

  // Fill missing symbols with defaults
  for (const sym of symbols) {
    if (!quoteMap[sym]) {
      quoteMap[sym] = {
        symbol: sym,
        latestPrice: 0,
        prevClose: 0,
        change: 0,
        changePercent: 0,
        trend: "up" as const,
      };
    }
  }

  return quoteMap;
}

export interface HistoryBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function getHistory(
  symbol: string,
  resolution: string,
  from: number,
  to: number,
): Promise<HistoryBar[]> {
  const intervalMap: Record<string, string> = {
    "1": "1m",
    "5": "5m",
    "15": "15m",
    "30": "30m",
    "60": "1h",
    "240": "4h",
    "1D": "1d",
    "1W": "1wk",
    "1M": "1mo",
  };

  const interval = intervalMap[resolution] || "1d";

  try {
    // Use Yahoo Finance v8 chart API directly
    const period1 = Math.floor(from);
    const period2 = Math.floor(to);

    const url = `${YF_BASE}/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${period1}&period2=${period2}&interval=${interval}&events=div%7Csplit`;

    const data = await fetchYF(url);

    if (!data?.chart?.result?.[0]) {
      console.warn(`No chart data for ${symbol}`);
      return [];
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};

    const bars: HistoryBar[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const open = quote.open?.[i];
      const high = quote.high?.[i];
      const low = quote.low?.[i];
      const close = quote.close?.[i];
      const volume = quote.volume?.[i];

      if (open == null || high == null || low == null || close == null) {
        continue;
      }

      bars.push({
        time: timestamps[i],
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume || 0),
      });
    }

    return bars;
  } catch (error) {
    console.error(`getHistory error for ${symbol}:`, error);
    return [];
  }
}

export async function searchSymbols(query: string, limit: number = 10) {
  try {
    const url = `${YF_BASE}/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=${limit}&newsCount=0`;
    const data = await fetchYF(url);

    return (
      (data?.quotes || []) as {
        quoteType: string;
        symbol: string;
        shortname?: string;
        longname?: string;
        exchDisp?: string;
        exchange: string;
      }[]
    )
      .filter(
        (q) =>
          q.quoteType === "EQUITY" ||
          q.quoteType === "ETF" ||
          q.quoteType === "CRYPTOCURRENCY",
      )
      .map((q) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        exchange: q.exchDisp || q.exchange,
        type: q.quoteType === "CRYPTOCURRENCY" ? "crypto" : "stock",
      }));
  } catch (error) {
    console.error(`search error for ${query}:`, error);
    return [];
  }
}
