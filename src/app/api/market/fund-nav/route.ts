import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    if (!code || !/^\d{6}$/.test(code)) {
        return NextResponse.json({ error: 'Invalid or missing fund code' }, { status: 400 })
    }

    try {
        const res = await fetch(`https://qt.gtimg.cn/q=jj${code}`, {
            headers: { Referer: 'https://finance.qq.com' },
            next: { revalidate: 60 },
        })
        const text = await res.text()
        const match = text.match(new RegExp(`v_jj${code}="([^"]+)"`))
        if (match) {
            const parts = match[1].split('~')
            return NextResponse.json({
                dwjz: parts[5] ?? '',
                zzl: parseFloat(parts[7] ?? '0'),
                jzrq: parts[8] ? parts[8].slice(0, 10) : '',
            })
        }
        return NextResponse.json({ error: 'Failed to parse fund NAV data' }, { status: 502 })
    } catch {
        return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
    }
}
