/** Locales that have their own URL prefix and server-rendered copy. */
export const LOCALES = ['en', 'zh'] as const

export type Locale = (typeof LOCALES)[number]

/** Cookie read by the proxy when an unprefixed URL needs a language. */
export const LOCALE_COOKIE = 'i18next'

/** Request header the proxy sets so the global 404 can render in the URL's language. */
export const LOCALE_HEADER = 'x-locale'

/** One year. Matches the preference window described on the privacy page. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** Previous client-only preference. Used once to mint the cookie, then the URL wins. */
export const LOCALE_STORAGE_KEY = 'i18nextLng'

export function isLocale(value: string | undefined | null): value is Locale {
    return value === 'en' || value === 'zh'
}

/**
 * Map any i18next-style tag onto a supported locale.
 * Unknown and empty tags fall back to English, matching the previous client.
 */
export function normalizeLanguage(lng: string | undefined | null): Locale {
    if (!lng) return 'en'
    return lng.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

/** True when the tag itself names English or Chinese, not merely the fallback. */
export function isRecognizedLanguageTag(value: string | undefined | null): boolean {
    if (!value) return false
    const tag = value.trim().toLowerCase()
    return tag.startsWith('en') || tag.startsWith('zh')
}

export function localeFromTag(value: string | undefined | null): Locale | null {
    if (!isRecognizedLanguageTag(value)) return null
    return normalizeLanguage(value)
}

export function readCookieValue(cookieHeader: string | null | undefined, name: string): string | null {
    if (!cookieHeader) return null
    for (const part of cookieHeader.split(';')) {
        const [rawKey, ...rest] = part.trim().split('=')
        if (rawKey !== name) continue
        const raw = rest.join('=')
        if (!raw) return ''
        try {
            return decodeURIComponent(raw)
        } catch {
            return raw
        }
    }
    return null
}

/** The language cookie, or null when it is missing or not one of our locales. */
export function localeFromCookie(cookieHeader: string | null | undefined): Locale | null {
    return localeFromTag(readCookieValue(cookieHeader, LOCALE_COOKIE))
}

/**
 * Highest-q `Accept-Language` tag we can serve.
 * `*` and unrelated languages are ignored so the caller can default to English.
 */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
    if (!header) return null
    const ranked = header
        .split(',')
        .map((part) => {
            const [tagRaw, ...params] = part.trim().split(';')
            const tag = tagRaw.trim().toLowerCase()
            const qParam = params.map((param) => param.trim().toLowerCase()).find((param) => param.startsWith('q='))
            const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1
            return { tag, q: Number.isNaN(q) ? 0 : q }
        })
        .filter((entry) => entry.tag && entry.q > 0)
        .sort((a, b) => b.q - a.q)

    for (const entry of ranked) {
        const locale = localeFromTag(entry.tag)
        if (locale) return locale
    }
    return null
}

/** Cookie wins over the browser language. English is the default. */
export function preferredLocale(
    cookieHeader: string | null | undefined,
    acceptLanguage: string | null | undefined,
): Locale {
    return localeFromCookie(cookieHeader) ?? localeFromAcceptLanguage(acceptLanguage) ?? 'en'
}

function pathOnly(path: string): string {
    const hashIndex = path.indexOf('#')
    const beforeHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path
    const queryIndex = beforeHash.indexOf('?')
    return queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash
}

export function localeFromPathname(pathname: string): Locale | null {
    const segment = pathOnly(pathname).split('/')[1]
    return isLocale(segment) ? segment : null
}

/**
 * Prefix a site path with a locale. Query and hash are preserved.
 * `/` becomes `/en`, not `/en/`.
 */
export function localePath(locale: Locale, path: string): string {
    const hashIndex = path.indexOf('#')
    const hash = hashIndex >= 0 ? path.slice(hashIndex) : ''
    const beforeHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path
    const queryIndex = beforeHash.indexOf('?')
    const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : ''
    const pathname = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash
    const normalized = pathname === '' || pathname === '/' ? '/' : pathname.startsWith('/') ? pathname : `/${pathname}`
    const prefixed = normalized === '/' ? `/${locale}` : `/${locale}${normalized}`
    return `${prefixed}${query}${hash}`
}

/** Swap the locale prefix, or add one when the path is a legacy unprefixed URL. */
export function replaceLocale(pathname: string, locale: Locale): string {
    const hashIndex = pathname.indexOf('#')
    const hash = hashIndex >= 0 ? pathname.slice(hashIndex) : ''
    const beforeHash = hashIndex >= 0 ? pathname.slice(0, hashIndex) : pathname
    const queryIndex = beforeHash.indexOf('?')
    const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : ''
    const bare = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash
    const segments = bare.split('/')
    if (isLocale(segments[1])) {
        segments[1] = locale
        const next = segments.join('/') || `/${locale}`
        return `${next}${query}${hash}`
    }
    return localePath(locale, pathname)
}

/**
 * Drop a leading `/en` or `/zh` so legacy lookups (`/`, `/t/:id`, `/privacy`)
 * keep working for content negotiation. Other first segments are left alone.
 */
export function stripLocalePrefix(pathname: string): string {
    const match = pathname.match(/^\/(en|zh)(\/.*)?$/)
    if (!match) return pathname
    const rest = match[2]
    if (!rest || rest === '/') return '/'
    return rest
}

export type LocaleRouting =
    | { action: 'next'; locale: Locale }
    | { action: 'redirect'; locale: Locale; pathname: string }

/**
 * Locale-prefixed URLs render as themselves.
 * Every other path redirects to the visitor's locale so shared legacy links keep resolving.
 */
export function resolveLocaleRouting(input: {
    pathname: string
    cookieHeader: string | null
    acceptLanguage: string | null
}): LocaleRouting {
    const current = localeFromPathname(input.pathname)
    if (current) return { action: 'next', locale: current }
    const locale = preferredLocale(input.cookieHeader, input.acceptLanguage)
    return { action: 'redirect', locale, pathname: localePath(locale, input.pathname) }
}

/**
 * One-time bridge for visitors who picked a language before it had a URL.
 * Runs only when the cookie is still empty, and only when stored and URL disagree.
 * Returns the path to replace to, or null when the current URL should stand.
 */
export function legacyStorageRedirect(
    pathname: string,
    storedLanguage: string | null,
    cookieHeader: string | null,
): string | null {
    if (localeFromCookie(cookieHeader)) return null
    const stored = localeFromTag(storedLanguage)
    if (!stored) return null
    const current = localeFromPathname(pathname)
    if (!current || current === stored) return null
    return replaceLocale(pathname, stored)
}

/**
 * Blocking head/body script. Sets the cookie from localStorage before paint and
 * navigates when that saved language disagrees with the URL. No-ops once a
 * cookie exists, so the URL stays the source of truth after the first visit.
 */
export const LOCALE_MIGRATION_SCRIPT = `(function () {
  try {
    var match = document.cookie.match(/(?:^|; )${LOCALE_COOKIE}=([^;]*)/);
    if (match) return;
    var stored = null;
    try { stored = localStorage.getItem('${LOCALE_STORAGE_KEY}'); } catch (e) {}
    if (!stored) return;
    var tag = String(stored).toLowerCase();
    var prefer = tag.indexOf('zh') === 0 ? 'zh' : tag.indexOf('en') === 0 ? 'en' : '';
    if (!prefer) return;
    document.cookie = '${LOCALE_COOKIE}=' + prefer + '; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax';
    var parts = location.pathname.split('/');
    if (parts[1] !== 'en' && parts[1] !== 'zh') return;
    if (parts[1] === prefer) return;
    document.documentElement.dataset.localeLock = prefer;
    parts[1] = prefer;
    location.replace(parts.join('/') + location.search + location.hash);
  } catch (e) {}
})();`

export function fillTemplate(template: string, vars: Record<string, string>): string {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => vars[key] ?? '')
}

/** Persist the language the visitor is actually on. Safe to call from the browser only. */
export function persistLocalePreference(locale: Locale) {
    if (typeof document === 'undefined') return
    // Locale is only `en` or `zh`, so the cookie string is not user-controlled.
    // biome-ignore lint/suspicious/noDocumentCookie: preference cookie must be readable by the proxy and the migration script
    document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`
    try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
        // Storage may be unavailable in privacy-restricted browser contexts.
    }
}
