import { apiError, apiSuccess, safeParseFloat, validateFundCode } from '@/lib/api-utils'
import { ValidationError } from '@/lib/error-handling'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const validationError = validateFundCode(code)
    if (validationError) {
        return apiError(new ValidationError(validationError), 400)
    }

    try {
        const res = await fetch(`https://qt.gtimg.cn/q=jj${code}`, {
            headers: { Referer: 'https://finance.qq.com' },
            next: { revalidate: 60 },
        })
        const text = await res.text()
        const match = text.match(new RegExp(`v_jj${code}="([^"]+)"`))
        if (match && match[1]) {
            const parts = match[1].split('~')
            return apiSuccess({
                nav: parts[5] ?? '',
                changeRate: safeParseFloat(parts[7]),
                navDate: parts[8] ? parts[8].slice(0, 10) : '',
            })
        }
        return apiError(new Error('Failed to parse fund NAV data'), 502)
    } catch (error) {
        console.error('[fund-nav] Error:', error)
        return apiError(error, 502)
    }
}
