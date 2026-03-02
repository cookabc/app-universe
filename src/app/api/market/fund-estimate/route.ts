import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    if (!code || !/^\d{6}$/.test(code)) {
        return NextResponse.json({ error: 'Invalid or missing fund code' }, { status: 400 })
    }

    try {
        const res = await fetch(`https://fundgz.1234567.com.cn/js/${code}.js?rt=${Date.now()}`, {
            headers: { Referer: 'https://fundf10.eastmoney.com' },
            next: { revalidate: 60 },
        })
        const text = await res.text()
        // Strip JSONP wrapper: jsonpgz({...})
        const match = text.match(/jsonpgz\((\{[^)]+\})\)/)
        if (match) {
            const json = JSON.parse(match[1])
            return NextResponse.json(json)
        }
        return NextResponse.json({ error: 'Failed to parse fund estimate data' }, { status: 502 })
    } catch {
        return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
    }
}
