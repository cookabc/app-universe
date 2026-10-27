'use client'

import { usePathname } from 'next/navigation'
import { createContext, useContext } from 'react'
import { isLocale, type Locale, localePath } from '@/lib/locale'

export const LocaleContext = createContext<Locale | null>(null)

export function useLocale(): Locale {
    const fromContext = useContext(LocaleContext)
    const pathname = usePathname()
    if (fromContext) return fromContext
    const segment = pathname?.split('/')[1]
    return isLocale(segment) ? segment : 'en'
}

/** Prefix an in-app path (`/`, `/t/id`, `/?tag=ai#tools`) with the current locale. */
export function useLocaleHref() {
    const locale = useLocale()
    return (path: string) => localePath(locale, path)
}
