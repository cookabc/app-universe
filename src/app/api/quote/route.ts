import { type NextRequest, NextResponse } from 'next/server'
import { getMockQuotes, isMockEnabled } from '@/lib/mock-data'

const YF_BASE = 'https://query1.finance.yahoo.com'

const cache = new Map<string, { data: unknown; expires: number }>()
const CACHE_TTL = 5 * 60_000
const MAX_SYMBOLS_PER_REQUEST = 50
const SYMBOL_PATTERN = /^[A-Z0-9.^=:_-]{1,24}$/i

interface YahooQuote {
    symbol: string
    regularMarketPrice?: number
    regularMarketPreviousClose?: number
    marketCap?: number
    regularMarketVolume?: number
    trailingPE?: number
    trailingEps?: number
    regularMarketDayHigh?: number
    regularMarketDayLow?: number
    regularMarketOpen?: number
    priceToBook?: number
    priceToSalesTrailing12Months?: number
    dividendYield?: number
    fiftyTwoWeekHigh?: number
    fiftyTwoWeekLow?: number
}

interface YahooQuoteResponse {
    quoteResponse?: {
        result?: YahooQuote[]
    }
}

function getYFHeaders() {
    return {
        'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://finance.yahoo.com',
        Origin: 'https://finance.yahoo.com',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Cache-Control': 'no-cache',
    }
}

async function fetchYF(url: string) {
    const cached = cache.get(url)
    if (cached && cached.expires > Date.now()) {
        return cached.data
    }

    try {
        const response = await fetch(url, {
            headers: getYFHeaders(),
        })
        if (!response.ok) throw new Error(`YF API error: ${response.status}`)
        const data = (await response.json()) as unknown
        cache.set(url, { data, expires: Date.now() + CACHE_TTL })
        return data
    } catch (error) {
        console.error(`fetchYF error for ${url}:`, error)
        return null
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const symbols = (url.searchParams.get('symbols')?.split(',') || [])
            .map((symbol) => symbol.trim())
            .filter((symbol, index, list) => symbol && list.indexOf(symbol) === index)
            .slice(0, MAX_SYMBOLS_PER_REQUEST)

        if (symbols.length === 0) {
            return NextResponse.json({}, { status: 200 })
        }

        const invalidSymbols = symbols.filter((symbol) => !SYMBOL_PATTERN.test(symbol))
        if (invalidSymbols.length > 0) {
            return NextResponse.json({ error: 'Invalid symbol format', invalidSymbols }, { status: 400 })
        }

        const useMock = isMockEnabled(url.searchParams)

        if (useMock) {
            const mockQuotes = getMockQuotes(symbols)
            const quoteMap: Record<string, unknown> = {}

            for (const sym of symbols) {
                const mock = mockQuotes[sym]
                if (mock) {
                    quoteMap[sym] = {
                        symbol: mock.symbol,
                        latestPrice: mock.latestPrice,
                        prevClose: mock.prevClose,
                        change: mock.change,
                        changePercent: mock.changePercent,
                        trend: mock.trend,
                        marketCap: mock.marketCap || null,
                        volume: mock.volume || null,
                        pe: mock.pe || null,
                        eps: mock.eps || null,
                        high: mock.high || null,
                        low: mock.low || null,
                        open: mock.open || null,
                        _mock: true,
                    }
                } else {
                    quoteMap[sym] = {
                        symbol: sym,
                        latestPrice: null,
                        prevClose: null,
                        change: null,
                        changePercent: null,
                        trend: 'up',
                        marketCap: null,
                        volume: null,
                        pe: null,
                        eps: null,
                        high: null,
                        low: null,
                        open: null,
                    }
                }
            }

            return NextResponse.json(quoteMap, { status: 200 })
        }

        const result = await fetchYF(`${YF_BASE}/v7/finance/quote?symbols=${encodeURIComponent(symbols.join(','))}`)
        const quoteResponse = result as YahooQuoteResponse
        const quotes = quoteResponse?.quoteResponse?.result || []

        const quoteMap: Record<string, unknown> = {}
        for (const q of quotes) {
            const latestPrice = q.regularMarketPrice || 0
            const prevClose = q.regularMarketPreviousClose || 0
            const change = latestPrice - prevClose
            const changePercent = prevClose ? (change / prevClose) * 100 : 0

            quoteMap[q.symbol] = {
                symbol: q.symbol,
                latestPrice,
                prevClose,
                change,
                changePercent,
                trend: changePercent >= 0 ? 'up' : 'down',
                marketCap: q.marketCap || null,
                volume: q.regularMarketVolume || null,
                pe: q.trailingPE || null,
                eps: q.trailingEps || null,
                pb: q.priceToBook || null,
                ps: q.priceToSalesTrailing12Months || null,
                dividendYield: q.dividendYield || null,
                fiftyTwoWeekHigh: q.fiftyTwoWeekHigh || null,
                fiftyTwoWeekLow: q.fiftyTwoWeekLow || null,
                high: q.regularMarketDayHigh || null,
                low: q.regularMarketDayLow || null,
                open: q.regularMarketOpen || null,
            }
        }

        for (const sym of symbols) {
            if (!quoteMap[sym]) {
                quoteMap[sym] = {
                    symbol: sym,
                    latestPrice: null,
                    prevClose: null,
                    change: null,
                    changePercent: null,
                    trend: 'up',
                    marketCap: null,
                    volume: null,
                    pe: null,
                    eps: null,
                    pb: null,
                    ps: null,
                    dividendYield: null,
                    fiftyTwoWeekHigh: null,
                    fiftyTwoWeekLow: null,
                    high: null,
                    low: null,
                    open: null,
                }
            }
        }

        return NextResponse.json(quoteMap, { status: 200 })
    } catch (error) {
        console.error('Error fetching quotes:', error)
        return NextResponse.json({}, { status: 200 })
    }
}
