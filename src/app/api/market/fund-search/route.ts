import { NextResponse } from 'next/server'

interface EastMoneyFundEntry {
    CATEGORY: number | string
    CATEGORYDESC: string
    CODE: string
    NAME: string
}

interface EastMoneySearchResponse {
    Datas?: EastMoneyFundEntry[]
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    if (!key?.trim()) return NextResponse.json([])

    try {
        const res = await fetch(
            `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${encodeURIComponent(key)}&_=${Date.now()}`,
            { headers: { Referer: 'https://fund.eastmoney.com' } },
        )
        const text = await res.text()

        let data: EastMoneySearchResponse | null = null
        // East Money may return JSONP or plain JSON — try both
        try {
            data = JSON.parse(text) as EastMoneySearchResponse
        } catch {
            const match = text.match(/\w+\((\{[\s\S]*\})\)/)
            if (match) data = JSON.parse(match[1]) as EastMoneySearchResponse
        }

        if (!data?.Datas) return NextResponse.json([])

        const fundsOnly = data.Datas.filter(
            (d) => d.CATEGORY === 700 || d.CATEGORY === '700' || d.CATEGORYDESC === '基金',
        )

        return NextResponse.json(fundsOnly.map((d) => ({ code: d.CODE, name: d.NAME })))
    } catch {
        return NextResponse.json([])
    }
}
