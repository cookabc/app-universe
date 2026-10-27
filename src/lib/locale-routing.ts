import { type Locale, resolveLocaleRouting } from './locale.ts'
import { isMarkdownExemptPath, wantsMarkdown } from './markdown.ts'

export type PublicRequestPlan =
    | { kind: 'passthrough' }
    | { kind: 'markdown' }
    | { kind: 'redirect'; locale: Locale; pathname: string }
    | { kind: 'html'; locale: Locale }

/**
 * Single-variant resources and explicit markdown requests never get a locale
 * redirect. Markdown is decided before the redirect so `Accept: text/markdown`
 * on a legacy URL still returns the document instead of a 307.
 */
export function planPublicRequest(input: {
    pathname: string
    accept: string | null
    cookieHeader: string | null
    acceptLanguage: string | null
}): PublicRequestPlan {
    const { pathname } = input
    // Same exemption as markdown negotiation, including every Open Graph image.
    if (isMarkdownExemptPath(pathname)) return { kind: 'passthrough' }
    if (wantsMarkdown(input.accept)) return { kind: 'markdown' }

    const decision = resolveLocaleRouting({
        pathname,
        cookieHeader: input.cookieHeader,
        acceptLanguage: input.acceptLanguage,
    })
    if (decision.action === 'redirect') {
        return { kind: 'redirect', locale: decision.locale, pathname: decision.pathname }
    }
    return { kind: 'html', locale: decision.locale }
}
