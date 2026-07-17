'use client'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
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
    i18n.use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            // Let LanguageDetector choose; do not force English on every load.
            fallbackLng: 'en',
            supportedLngs: ['en', 'zh'],
            nonExplicitSupportedLngs: true,
            load: 'languageOnly',
            ns: ['common'],
            defaultNS: 'common',
            detection: {
                order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
                caches: ['cookie', 'localStorage'],
                lookupCookie: 'i18next',
                lookupLocalStorage: 'i18nextLng',
            },
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

export function I18nProvider({ children }: I18nProviderProps) {
    const { i18n: i18nInstance } = useTranslation()

    useEffect(() => {
        const syncDocumentLang = (lng: string) => {
            document.documentElement.lang = normalizeLanguage(lng)
        }

        syncDocumentLang(i18nInstance.language)
        i18nInstance.on('languageChanged', syncDocumentLang)
        return () => {
            i18nInstance.off('languageChanged', syncDocumentLang)
        }
    }, [i18nInstance])

    return <>{children}</>
}

export { normalizeLanguage }
