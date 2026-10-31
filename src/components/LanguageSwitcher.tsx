'use client'

import { normalizeLanguage } from '@/components/I18nProvider'
import { useI18nReady } from '@/hooks/useI18nReady'

export function LanguageSwitcher() {
    const { i18n, t } = useI18nReady()
    const isZh = normalizeLanguage(i18n.language) === 'zh'

    return (
        <button
            type="button"
            onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh')}
            className="chrome-btn caps"
            aria-label={isZh ? t('language.switchToEn') : t('language.switchToZh')}
        >
            {isZh ? 'EN' : '中文'}
        </button>
    )
}
