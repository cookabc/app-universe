import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { MARKDOWN_PATH_HEADER, resolveMarkdownForPath } from '@/lib/markdown'

const MARKDOWN_HEADERS = {
    'Content-Type': 'text/markdown; charset=utf-8',
    // Both variants (HTML and markdown) live on the same URL — caches must key on Accept.
    Vary: 'Accept, Accept-Encoding',
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
} as const

function markdownResponse(request: NextRequest): NextResponse {
    // Content-negotiated requests arrive via proxy rewrite, which forwards the
    // original page path in a header; direct hits can use ?path= instead.
    const path = new URL(request.url).searchParams.get('path') ?? request.headers.get(MARKDOWN_PATH_HEADER) ?? '/'
    const { status, body } = resolveMarkdownForPath(path)
    return new NextResponse(body, { status, headers: MARKDOWN_HEADERS })
}

export function GET(request: NextRequest) {
    return markdownResponse(request)
}

export function HEAD(request: NextRequest) {
    const response = markdownResponse(request)
    return new NextResponse(null, { status: response.status, headers: response.headers })
}
