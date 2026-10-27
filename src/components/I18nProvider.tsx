'use client'

import i18n from 'i18next'
import { useEffect, useState } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import enTranslations from '@/../public/locales/en/common.json'
import zhTranslations from '@/../public/locales/zh/common.json'
import { LocaleContext } from '@/hooks/useLocaleHref'
import { type Locale, localeFromCookie, persistLocalePreference } from '@/lib/locale'

const resources = {
    en: { common: enTranslations },
    zh: { common: zhTranslations },
}

function createI18n(locale: Locale) {
    const instance = i18n.createInstance()
    instance.use(initReactI18next).init({
        resources,
        lng: locale,
        fallbackLng: 'en',
        supportedLngs: ['en', 'zh'],
        nonExplicitSupportedLngs: true,
        load: 'languageOnly',
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
            // React escapes interpolated values itself; enabling this
            // double-escapes entities (e.g. "&" → "&amp;").
            escapeValue: false,
        },
        react: { useSuspense: false },
    })
    return instance
}

interface I18nProviderProps {
    locale: Locale
    children: React.ReactNode
}

/**
 * The URL locale is the language of this document. The instance is created
 * with that locale so server HTML and hydration match — nothing here swaps
 * the language after paint. The cookie is written only when missing, so
 * opening a shared link does not overwrite a returning visitor's preference.
 * The language switcher writes the cookie itself before navigating.
 */
export function I18nProvider({ locale, children }: I18nProviderProps) {
    const [instance] = useState(() => createI18n(locale))

    useEffect(() => {
        const lock = document.documentElement.dataset.localeLock
        if (lock && lock !== locale) return
        document.documentElement.lang = locale
        if (!localeFromCookie(document.cookie)) {
            persistLocalePreference(locale)
        }
    }, [locale])

    return (
        <LocaleContext.Provider value={locale}>
            <I18nextProvider i18n={instance}>{children}</I18nextProvider>
        </LocaleContext.Provider>
    )
}

export { normalizeLanguage } from '@/lib/locale'
