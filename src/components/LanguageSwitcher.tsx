'use client'

import { normalizeLanguage } from '@/components/I18nProvider'
import { useI18nReady } from '@/hooks/useI18nReady'

export function LanguageSwitcher() {
    const { i18n, t, isReady } = useI18nReady()
    const isZh = normalizeLanguage(i18n.language) === 'zh'
    const label = isReady
        ? isZh
            ? t('language.switchToEn')
            : t('language.switchToZh')
        : isZh
          ? 'Switch to English'
          : '切换到中文'

    return (
        <button
            type="button"
            onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh')}
            className="index-label index-label--foreground inline-flex h-11 min-w-11 items-center justify-center border border-border bg-card px-3 hover:border-foreground hover:bg-accent transition-colors"
            aria-label={label}
        >
            {isZh ? 'EN' : '中文'}
        </button>
    )
}
