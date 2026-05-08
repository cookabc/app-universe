// Mock data for development when Yahoo Finance API is unavailable
// Toggle via ?mock=true query param or MOCK_DATA env variable

export const isMockEnabled = (searchParams?: URLSearchParams): boolean => {
    const mockParam = searchParams?.get('mock')
    if (mockParam === 'true') return true
    if (mockParam === 'false') return false

    // Check env var (for server-side)
    if (process.env.MOCK_DATA === 'true') return true
    // Default to true for local dev to avoid rate limiting
    if (process.env.NODE_ENV === 'development') return true
    return false
}

export interface MockQuote {
    symbol: string
    latestPrice: number
    prevClose: number
    change: number
    changePercent: number
    trend: 'up' | 'down'
    marketCap: number
    volume: number
    pe: number
    eps: number
    high: number
    low: number
    open: number
}

const MOCK_QUOTES: Record<string, MockQuote> = {
    AAPL: {
        symbol: 'AAPL',
        latestPrice: 189.52,
        prevClose: 187.68,
        change: 1.84,
        changePercent: 0.98,
        trend: 'up',
        marketCap: 2890000000000,
        volume: 45678900,
        pe: 29.5,
        eps: 6.42,
        high: 190.12,
        low: 188.34,
        open: 188.5,
    },
    GOOGL: {
        symbol: 'GOOGL',
        latestPrice: 330.47,
        prevClose: 335.4,
        change: -4.93,
        changePercent: -1.47,
        trend: 'down',
        marketCap: 4000000000000,
        volume: 14620000,
        pe: 10.926,
        eps: 10.926,
        high: 337.17,
        low: 329.63,
        open: 335.59,
    },
    MSFT: {
        symbol: 'MSFT',
        latestPrice: 420.15,
        prevClose: 418.9,
        change: 1.25,
        changePercent: 0.3,
        trend: 'up',
        marketCap: 3120000000000,
        volume: 18923400,
        pe: 36.2,
        eps: 11.6,
        high: 421.5,
        low: 419.1,
        open: 419.5,
    },
    NVDA: {
        symbol: 'NVDA',
        latestPrice: 875.42,
        prevClose: 890.15,
        change: -14.73,
        changePercent: -1.65,
        trend: 'down',
        marketCap: 2150000000000,
        volume: 45678900,
        pe: 72.5,
        eps: 12.08,
        high: 892.3,
        low: 870.1,
        open: 888.5,
    },
    AMD: {
        symbol: 'AMD',
        latestPrice: 162.35,
        prevClose: 165.2,
        change: -2.85,
        changePercent: -1.73,
        trend: 'down',
        marketCap: 262000000000,
        volume: 34567800,
        pe: 185.2,
        eps: 0.88,
        high: 166.0,
        low: 161.2,
        open: 164.8,
    },
    MU: {
        symbol: 'MU',
        latestPrice: 128.45,
        prevClose: 126.8,
        change: 1.65,
        changePercent: 1.3,
        trend: 'up',
        marketCap: 142000000000,
        volume: 12345600,
        pe: -12.5,
        eps: -10.28,
        high: 129.2,
        low: 127.1,
        open: 127.5,
    },
    ASML: {
        symbol: 'ASML',
        latestPrice: 1025.6,
        prevClose: 1018.3,
        change: 7.3,
        changePercent: 0.72,
        trend: 'up',
        marketCap: 405000000000,
        volume: 9876500,
        pe: 42.3,
        eps: 24.25,
        high: 1030.0,
        low: 1015.5,
        open: 1019.0,
    },
    META: {
        symbol: 'META',
        latestPrice: 498.2,
        prevClose: 495.1,
        change: 3.1,
        changePercent: 0.63,
        trend: 'up',
        marketCap: 1270000000000,
        volume: 15678900,
        pe: 27.8,
        eps: 17.92,
        high: 500.5,
        low: 496.2,
        open: 497.0,
    },
    AMZN: {
        symbol: 'AMZN',
        latestPrice: 178.35,
        prevClose: 176.8,
        change: 1.55,
        changePercent: 0.88,
        trend: 'up',
        marketCap: 1850000000000,
        volume: 32145600,
        pe: 60.5,
        eps: 2.95,
        high: 179.2,
        low: 177.1,
        open: 177.5,
    },
    TSLA: {
        symbol: 'TSLA',
        latestPrice: 172.8,
        prevClose: 175.4,
        change: -2.6,
        changePercent: -1.48,
        trend: 'down',
        marketCap: 550000000000,
        volume: 67890100,
        pe: 45.2,
        eps: 3.82,
        high: 176.5,
        low: 171.2,
        open: 175.0,
    },
    SPY: {
        symbol: 'SPY',
        latestPrice: 520.45,
        prevClose: 518.2,
        change: 2.25,
        changePercent: 0.43,
        trend: 'up',
        marketCap: 0,
        volume: 45678900,
        pe: 0,
        eps: 0,
        high: 521.3,
        low: 519.1,
        open: 519.5,
    },
    QQQ: {
        symbol: 'QQQ',
        latestPrice: 445.8,
        prevClose: 443.5,
        change: 2.3,
        changePercent: 0.52,
        trend: 'up',
        marketCap: 0,
        volume: 23456700,
        pe: 0,
        eps: 0,
        high: 446.5,
        low: 444.2,
        open: 444.0,
    },
    MARA: {
        symbol: 'MARA',
        latestPrice: 18.45,
        prevClose: 17.8,
        change: 0.65,
        changePercent: 3.65,
        trend: 'up',
        marketCap: 3200000000,
        volume: 45678900,
        pe: -8.5,
        eps: -2.17,
        high: 19.1,
        low: 17.5,
        open: 18.0,
    },
    RIOT: {
        symbol: 'RIOT',
        latestPrice: 10.85,
        prevClose: 10.5,
        change: 0.35,
        changePercent: 3.33,
        trend: 'up',
        marketCap: 2100000000,
        volume: 23456700,
        pe: -5.2,
        eps: -2.09,
        high: 11.2,
        low: 10.3,
        open: 10.6,
    },
    'BTC-USD': {
        symbol: 'BTC-USD',
        latestPrice: 67250.0,
        prevClose: 66500.0,
        change: 750.0,
        changePercent: 1.13,
        trend: 'up',
        marketCap: 1320000000000,
        volume: 28900000000,
        pe: 0,
        eps: 0,
        high: 67800.0,
        low: 66200.0,
        open: 66600.0,
    },
    'ETH-USD': {
        symbol: 'ETH-USD',
        latestPrice: 3520.0,
        prevClose: 3480.0,
        change: 40.0,
        changePercent: 1.15,
        trend: 'up',
        marketCap: 423000000000,
        volume: 15200000000,
        pe: 0,
        eps: 0,
        high: 3560.0,
        low: 3460.0,
        open: 3490.0,
    },
    '^DJI': {
        symbol: '^DJI',
        latestPrice: 39150.2,
        prevClose: 39050.8,
        change: 99.4,
        changePercent: 0.25,
        trend: 'up',
        marketCap: 0,
        volume: 0,
        pe: 0,
        eps: 0,
        high: 39200.0,
        low: 39000.0,
        open: 39080.0,
    },
    '^IXIC': {
        symbol: '^IXIC',
        latestPrice: 16250.8,
        prevClose: 16180.4,
        change: 70.4,
        changePercent: 0.44,
        trend: 'up',
        marketCap: 0,
        volume: 0,
        pe: 0,
        eps: 0,
        high: 16300.0,
        low: 16150.0,
        open: 16200.0,
    },
    '^GSPC': {
        symbol: '^GSPC',
        latestPrice: 5230.6,
        prevClose: 5215.3,
        change: 15.3,
        changePercent: 0.29,
        trend: 'up',
        marketCap: 0,
        volume: 0,
        pe: 0,
        eps: 0,
        high: 5240.0,
        low: 5210.0,
        open: 5220.0,
    },
}

export function getMockQuote(symbol: string): MockQuote | null {
    const upper = symbol.toUpperCase()
    if (MOCK_QUOTES[upper]) {
        // Add small random variation to make it look alive
        const base = MOCK_QUOTES[upper]
        const variation = (Math.random() - 0.5) * 0.002 // ±0.1%
        const latestPrice = base.latestPrice * (1 + variation)
        const prevClose = base.prevClose
        const change = latestPrice - prevClose
        const changePercent = (change / prevClose) * 100
        return {
            ...base,
            latestPrice: Number(latestPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            trend: changePercent >= 0 ? 'up' : 'down',
        }
    }
    return null
}

export function getMockQuotes(symbols: string[]): Record<string, MockQuote> {
    const result: Record<string, MockQuote> = {}
    for (const sym of symbols) {
        const mock = getMockQuote(sym)
        if (mock) {
            result[sym] = mock
        }
    }
    return result
}

// Generate mock history bars
export function getMockHistory(symbol: string, resolution: string, from: number, to: number) {
    const bars: Array<{
        time: number
        open: number
        high: number
        low: number
        close: number
        volume: number
    }> = []

    const basePrice = MOCK_QUOTES[symbol.toUpperCase()]?.latestPrice || 100
    let currentPrice = basePrice * 0.85 // Start lower to show trend

    const intervalSeconds =
        resolution === '1D'
            ? 86400
            : resolution === '1W'
              ? 604800
              : resolution === '1M'
                ? 2592000
                : resolution === '60'
                  ? 3600
                  : resolution === '240'
                    ? 14400
                    : resolution === '30'
                      ? 1800
                      : resolution === '15'
                        ? 900
                        : resolution === '5'
                          ? 300
                          : 60

    for (let t = from; t <= to; t += intervalSeconds) {
        const volatility = basePrice * 0.02
        const trend = (basePrice - currentPrice) * 0.01
        const open = currentPrice
        const change = (Math.random() - 0.48) * volatility + trend
        const close = open + change
        const high = Math.max(open, close) + Math.random() * volatility * 0.3
        const low = Math.min(open, close) - Math.random() * volatility * 0.3
        const volume = Math.floor(1000000 + Math.random() * 5000000)

        bars.push({
            time: t,
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2)),
            volume,
        })

        currentPrice = close
    }

    const lastClose = bars.at(-1)?.close
    if (!lastClose) return bars

    const scale = basePrice / lastClose
    return bars.map((bar) => ({
        ...bar,
        open: Number((bar.open * scale).toFixed(2)),
        high: Number((bar.high * scale).toFixed(2)),
        low: Number((bar.low * scale).toFixed(2)),
        close: Number((bar.close * scale).toFixed(2)),
    }))
}
