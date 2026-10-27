import { type NextRequest, NextResponse } from 'next/server'
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, LOCALE_HEADER } from '@/lib/locale'
import { planPublicRequest } from '@/lib/locale-routing'
import { MARKDOWN_PATH_HEADER } from '@/lib/markdown'

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

    const plan = planPublicRequest({
        pathname: request.nextUrl.pathname,
        accept: request.headers.get('accept'),
        cookieHeader: request.headers.get('cookie'),
        acceptLanguage: request.headers.get('accept-language'),
    })

    // Files with extensions (robots.txt, sitemap.xml, icon.svg, ...) and every
    // Open Graph image are single-variant resources; serve them as-is.
    if (plan.kind === 'passthrough') return NextResponse.next()

    if (plan.kind === 'markdown') {
        // Rewritten requests keep their original URL, so forward the page path
        // in a request header for the markdown route handler.
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set(MARKDOWN_PATH_HEADER, request.nextUrl.pathname)
        const url = request.nextUrl.clone()
        url.pathname = MARKDOWN_ROUTE
        url.search = ''
        return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
    }

    if (plan.kind === 'redirect') {
        // Negotiation depends on the cookie and Accept-Language, so this
        // response must not be stored and reused for a different visitor.
        const url = request.nextUrl.clone()
        url.pathname = plan.pathname
        const redirect = NextResponse.redirect(url, 307)
        redirect.headers.set('Vary', 'Accept, Cookie, Accept-Language')
        redirect.headers.set('Cache-Control', 'private, no-store')
        redirect.cookies.set(LOCALE_COOKIE, plan.locale, {
            path: '/',
            maxAge: LOCALE_COOKIE_MAX_AGE,
            sameSite: 'lax',
        })
        return redirect
    }

    // This URL also exists as a text/markdown variant keyed on Accept.
    // The app renderer later replaces this Vary via setHeader;
    // src/instrumentation.ts appends Accept back onto that write so production
    // caches still vary on Accept. The HTML itself does not vary by cookie:
    // the locale is in the path.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(LOCALE_HEADER, plan.locale)
    requestHeaders.set('x-pathname', request.nextUrl.pathname)
    const html = NextResponse.next({ request: { headers: requestHeaders } })
    html.headers.append('Vary', 'Accept')
    return html
}

export const config = {
    matcher: '/((?!_next/|api/|previews/|locales/|puzzles).*)',
}
