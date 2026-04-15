import { apiError, apiSuccess, safeParseFloat } from '@/lib/api-utils'

export async function GET() {
    try {
        const res = await fetch(`https://qt.gtimg.cn/q=s_sh000001,s_sz399001,s_sz399006&_t=${Date.now()}`, {
            headers: { Referer: 'https://finance.qq.com' },
            next: { revalidate: 30 },
        })
        const text = await res.text()

        const mapping = [
            { key: 'v_s_sh000001', name: '上证' },
            { key: 'v_s_sz399001', name: '深证' },
            { key: 'v_s_sz399006', name: '创业板' },
        ]

        const indices = mapping.flatMap(({ key, name }) => {
            const match = text.match(new RegExp(`${key}="([^"]+)"`))
            if (!match || !match[1]) return []
            const parts = match[1].split('~')
            if (parts.length <= 5) return []
            return [{ name, price: parts[3] ?? '', change: safeParseFloat(parts[5]) }]
        })

        return apiSuccess(indices)
    } catch (error) {
        console.error('[indices] Error:', error)
        return apiError(error, 502)
    }
}
