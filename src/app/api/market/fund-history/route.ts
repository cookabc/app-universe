import { NextResponse } from 'next/server'

interface NetWorthPoint {
    x: number // Unix timestamp ms
    y: number // NAV value
    equityReturn?: number
    unitMoney?: string
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    if (!code || !/^\d{6}$/.test(code)) {
        return NextResponse.json({ error: 'Invalid or missing fund code' }, { status: 400 })
    }

    try {
        const res = await fetch(`https://fund.eastmoney.com/pingzhongdata/${code}.js?v=${Date.now()}`, {
            headers: { Referer: 'https://fund.eastmoney.com' },
            next: { revalidate: 3600 },
        })
        const text = await res.text()
        const match = text.match(/var\s+Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/)
        if (match) {
            const raw: NetWorthPoint[] = JSON.parse(match[1])
            const trend = raw.slice(-30).map((item) => ({
                date: new Date(item.x).toISOString().slice(0, 10),
                value: item.y,
            }))
            return NextResponse.json(trend)
        }
        return NextResponse.json([])
    } catch {
        return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
    }
}
