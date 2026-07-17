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
            className="h-7 px-2.5 text-[11px] font-medium radius-inner border border-border bg-card text-muted-foreground hover:text-foreground shadow-sm hover:border-primary/30 active:translate-y-px active:scale-[0.98] transition-all duration-200"
            aria-label={label}
        >
            {isZh ? 'EN' : '中文'}
        </button>
    )
}
