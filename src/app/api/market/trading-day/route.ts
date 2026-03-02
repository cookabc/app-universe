import { NextResponse } from 'next/server'

export async function GET() {
    const now = new Date()
    const isWeekend = now.getDay() === 0 || now.getDay() === 6

    if (isWeekend) {
        return NextResponse.json({ isTradingDay: false })
    }

    try {
        const res = await fetch(`https://qt.gtimg.cn/q=sh000001&_t=${Date.now()}`, {
            headers: { Referer: 'https://finance.qq.com' },
            next: { revalidate: 60 },
        })
        const text = await res.text()
        const match = text.match(/v_sh000001="([^"]+)"/)
        if (match) {
            const parts = match[1].split('~')
            const dateStr = parts[30]?.slice(0, 8) ?? ''
            const todayStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
            const minutes = now.getHours() * 60 + now.getMinutes()
            // If market hasn't opened yet (before 9:30), treat as trading day
            const isTradingDay = dateStr === todayStr || minutes < 9 * 60 + 30
            return NextResponse.json({ isTradingDay })
        }
    } catch {
        // Fall through to default
    }

    return NextResponse.json({ isTradingDay: !isWeekend })
}
