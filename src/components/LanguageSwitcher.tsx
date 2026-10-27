'use client'

import { usePathname } from 'next/navigation'
import { useI18nReady } from '@/hooks/useI18nReady'
import { useLocale } from '@/hooks/useLocaleHref'
import { persistLocalePreference, replaceLocale } from '@/lib/locale'

export function LanguageSwitcher() {
    const { t, isReady } = useI18nReady()
    const locale = useLocale()
    const pathname = usePathname()
    const next = locale === 'zh' ? 'en' : 'zh'
    const targetPath = replaceLocale(pathname, next)
    const label = isReady
        ? next === 'en'
            ? t('language.switchToEn')
            : t('language.switchToZh')
        : next === 'en'
          ? 'Switch to English'
          : '切换到中文'

    return (
        <a
            href={targetPath}
            hrefLang={next}
            lang={next}
            onClick={(event) => {
                persistLocalePreference(next)
                const suffix = `${window.location.search}${window.location.hash}`
                if (!suffix) return
                event.preventDefault()
                window.location.assign(`${targetPath}${suffix}`)
            }}
            className="index-label index-label--foreground inline-flex h-11 min-w-11 items-center justify-center border border-border bg-card px-3 hover:border-foreground hover:bg-accent transition-colors"
            aria-label={label}
        >
            {locale === 'zh' ? 'EN' : '中文'}
        </a>
    )
}
