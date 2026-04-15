'use client'

import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { ConverterForm } from './components/converter-form'
import { HistorySection } from './components/history-section'
import { useLanguageConverter } from './hooks/useLanguageConverter'

export default function LangConverterClient() {
    const { t, i18n } = useTranslation()
    const uiLanguage = i18n.language as 'en' | 'ja' | 'zh'

    const {
        inputText,
        outputText,
        fromLang,
        toLang,
        fromType,
        toType,
        isLoading,
        error,
        history,
        copied,
        activeTab,
        conversionStats,
        setInputText,
        setFromLang,
        setToLang,
        setFromType,
        setToType,
        setActiveTab,
        convertText,
        copyToClipboard,
        clearHistory,
        switchLanguages,
        speakText,
    } = useLanguageConverter({ uiLanguage })

    return (
        <AppErrorBoundary>
            <div className="min-h-[calc(100vh-64px)] bg-background text-foreground flex flex-col items-center justify-center py-8">
                <div className="w-full max-w-4xl px-4">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center mb-8 space-y-3"
                    >
                        <div className="p-3 rounded-[var(--radius)] bg-primary/10 text-primary border-2 border-slate-800 shadow-[var(--box-shadow)] mb-1">
                            <Languages className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('langConverter.appName')}</h1>
                        <p className="text-muted-foreground text-base max-w-lg">{t('langConverter.subtitle')}</p>
                    </motion.div>

                    {/* Main Translation Area */}
                    <ConverterForm
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        fromLang={fromLang}
                        setFromLang={setFromLang}
                        toLang={toLang}
                        setToLang={setToLang}
                        fromType={fromType}
                        setFromType={setFromType}
                        toType={toType}
                        setToType={setToType}
                        switchLanguages={switchLanguages}
                        inputText={inputText}
                        setInputText={setInputText}
                        convertText={convertText}
                        isLoading={isLoading}
                        uiLanguage={uiLanguage}
                        outputText={outputText}
                        error={error}
                        copied={copied}
                        copyToClipboard={copyToClipboard}
                        speakText={speakText}
                    />

                    {/* History Section (below, only appears when entries exist) */}
                    {history.length > 0 && (
                        <div className="mt-6">
                            <HistorySection
                                history={history}
                                clearHistory={clearHistory}
                                conversionStats={conversionStats}
                                uiLanguage={uiLanguage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AppErrorBoundary>
    )
}
