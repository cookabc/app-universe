import { NextRequest, NextResponse } from 'next/server'
import { getHistory } from '@/lib/yahoo-finance'
import { isMockEnabled, getMockHistory } from '@/lib/mock-data'

const ALLOWED_RESOLUTIONS = new Set(['1', '5', '15', '30', '60', '240', '1D', '1W', '1M'])
const SYMBOL_PATTERN = /^[A-Z0-9.^=:_-]{1,24}$/i

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const symbol = searchParams.get('symbol')
    const resolution = searchParams.get('resolution') || '1D'
    const from = parseInt(searchParams.get('from') || '0', 10)
    const to = parseInt(searchParams.get('to') || '0', 10)
    const countback = parseInt(searchParams.get('countback') || '0', 10)

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
    }

    if (!SYMBOL_PATTERN.test(symbol)) {
        return NextResponse.json({ error: 'Invalid symbol format' }, { status: 400 })
    }

    if (!ALLOWED_RESOLUTIONS.has(resolution)) {
        return NextResponse.json({ error: 'Unsupported resolution' }, { status: 400 })
    }

    if (!Number.isFinite(from) || !Number.isFinite(to) || from < 0 || to < 0) {
        return NextResponse.json({ error: 'Invalid time range' }, { status: 400 })
    }

    try {
        let bars

        // Check if mock data is enabled
        const useMock = isMockEnabled(searchParams)

        if (useMock) {
            bars = getMockHistory(symbol, resolution, from, to)
        } else {
            bars = await getHistory(symbol, resolution, from, to)
        }

        // 处理 countback
        if (countback > 0 && bars.length > countback) {
            bars = bars.slice(-countback)
        }

        // 转换为 UDF 格式
        const udfResponse = {
            s: bars.length > 0 ? 'ok' : 'no_data',
            t: bars.map((b) => b.time),
            o: bars.map((b) => b.open),
            h: bars.map((b) => b.high),
            l: bars.map((b) => b.low),
            c: bars.map((b) => b.close),
            v: bars.map((b) => b.volume),
        }

        return NextResponse.json(udfResponse)
    } catch (error) {
        console.error('History API error:', error)
        return NextResponse.json({ s: 'error', errmsg: 'Failed to fetch history data' }, { status: 500 })
    }
}
