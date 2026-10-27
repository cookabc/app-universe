import { headers } from 'next/headers'
import { isLocale, LOCALE_HEADER, type Locale, localeFromPathname } from '@/lib/locale'

/** Locale stamped by the proxy, with the path header as a fallback. */
export async function requestLocale(): Promise<Locale> {
    const headerStore = await headers()
    const marked = headerStore.get(LOCALE_HEADER)
    if (isLocale(marked)) return marked
    return localeFromPathname(headerStore.get('x-pathname') ?? '') ?? 'en'
}
