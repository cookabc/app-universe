'use client'

import i18n from 'i18next'
import { useEffect } from 'react'
import { initReactI18next, useTranslation } from 'react-i18next'
import enTranslations from '@/../public/locales/en/common.json'
import zhTranslations from '@/../public/locales/zh/common.json'

const resources = {
    en: { common: enTranslations },
    zh: { common: zhTranslations },
}

function normalizeLanguage(lng: string | undefined): 'en' | 'zh' {
    if (!lng) return 'en'
    return lng.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources,
        // Server render and the browser's first render must use the same
        // language. The saved browser preference is applied after hydration.
        lng: 'en',
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
    })
}

interface I18nProviderProps {
    children: React.ReactNode
}

function getPreferredBrowserLanguage(): 'en' | 'zh' {
    const cookieLanguage = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith('i18next='))
        ?.split('=')[1]

    let storedLanguage: string | null = null
    try {
        storedLanguage = window.localStorage.getItem('i18nextLng')
    } catch {
        // Storage may be unavailable in privacy-restricted browser contexts.
    }

    return normalizeLanguage(storedLanguage || cookieLanguage || window.navigator.language)
}

export function I18nProvider({ children }: I18nProviderProps) {
    const { i18n: i18nInstance } = useTranslation()

    useEffect(() => {
        const syncDocumentLang = (lng: string) => {
            const normalized = normalizeLanguage(lng)
            document.documentElement.lang = normalized

            try {
                window.localStorage.setItem('i18nextLng', normalized)
            } catch {
                // Keep language switching functional when storage is blocked.
            }
        }

        i18nInstance.on('languageChanged', syncDocumentLang)
        const preferredLanguage = getPreferredBrowserLanguage()
        if (normalizeLanguage(i18nInstance.language) !== preferredLanguage) {
            void i18nInstance.changeLanguage(preferredLanguage)
        } else {
            syncDocumentLang(preferredLanguage)
        }

        return () => {
            i18nInstance.off('languageChanged', syncDocumentLang)
        }
    }, [i18nInstance])

    return <>{children}</>
}

export { normalizeLanguage }
