import { type NextRequest, NextResponse } from 'next/server'
import { MARKDOWN_PATH_HEADER, wantsMarkdown } from '@/lib/markdown'

const MARKDOWN_ROUTE = '/api/markdown'
const IMAGE_ROUTE = '/opengraph-image'

/**
 * Content negotiation (acceptmarkdown.com): clients that explicitly ask for
 * `text/markdown` get the markdown representation of the page; everyone else
 * (browsers, RSC navigation) continues to the HTML app untouched.
 */
export function proxy(request: NextRequest) {
    if (request.method !== 'GET' && request.method !== 'HEAD') return NextResponse.next()
    // Never intercept React Server Component navigations or prefetches.
    if (request.headers.has('rsc') || request.headers.has('next-router-prefetch')) return NextResponse.next()

    const { pathname } = request.nextUrl
    // Files with extensions (robots.txt, sitemap.xml, icon.svg, ...) and the
    // OpenGraph image route are single-variant resources; serve them as-is.
    if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next()
    if (pathname === IMAGE_ROUTE || pathname.startsWith(MARKDOWN_ROUTE)) return NextResponse.next()

    if (!wantsMarkdown(request.headers.get('accept'))) {
        // This URL also exists as a text/markdown variant keyed on Accept —
        // caches must not serve one variant for the other. (next start's static
        // path replaces Vary locally; the Vercel edge applies this header.)
        const html = NextResponse.next()
        html.headers.append('Vary', 'Accept')
        return html
    }

    // Rewritten requests keep their original URL, so forward the page path
    // in a request header for the markdown route handler.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(MARKDOWN_PATH_HEADER, pathname)
    const url = request.nextUrl.clone()
    url.pathname = MARKDOWN_ROUTE
    url.search = ''
    const markdown = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
    return markdown
}

export const config = {
    matcher: '/((?!_next/|api/|previews/|locales/).*)',
}
