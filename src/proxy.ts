import { type NextRequest, NextResponse } from 'next/server'
import { isMarkdownExemptPath, MARKDOWN_PATH_HEADER, wantsMarkdown } from '@/lib/markdown'

const MARKDOWN_ROUTE = '/api/markdown'

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
    // Files with extensions (robots.txt, sitemap.xml, icon.svg, ...) and every
    // Open Graph image are single-variant resources; serve them as-is.
    if (isMarkdownExemptPath(pathname)) return NextResponse.next()

    if (!wantsMarkdown(request.headers.get('accept'))) {
        // Same URL also serves text/markdown. The app renderer later replaces
        // this Vary via setHeader; src/instrumentation.ts appends Accept back
        // onto that write so production caches still vary on Accept.
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
    matcher: '/((?!_next/|api/|previews/|locales/|puzzles).*)',
}
