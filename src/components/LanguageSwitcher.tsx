'use client'

import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const isZh = i18n.language === 'zh'

    return (
        <button
            type="button"
            onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh')}
            className="h-7 px-2.5 text-[11px] font-medium radius-inner border border-border bg-card text-muted-foreground hover:text-foreground shadow-sm hover:border-primary/30 active:translate-y-px active:scale-[0.98] transition-all duration-200"
            aria-label={isZh ? 'Switch to English' : '切换到中文'}
        >
            {isZh ? 'EN' : '中文'}
        </button>
    )
}
