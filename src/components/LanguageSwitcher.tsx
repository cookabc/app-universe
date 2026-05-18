'use client'

import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const isZh = i18n.language === 'zh'

    return (
        <button
            type="button"
            onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh')}
            className="h-6 px-2 text-[11px] font-medium rounded-md border-2 border-slate-800 bg-card text-muted-foreground hover:text-foreground shadow-[var(--box-shadow)] hover:-translate-y-px transition-all duration-200"
            aria-label={isZh ? 'Switch to English' : '切换到中文'}
        >
            {isZh ? 'EN' : '中文'}
        </button>
    )
}
