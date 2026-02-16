'use client'

import { useState } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { ConverterForm } from './components/converter-form'
import { HistorySection } from './components/history-section'
import { ResultDisplay } from './components/result-display'
import { useLanguageConverter } from './hooks/useLanguageConverter'

export default function LangConverterClient() {
    const [uiLanguage, setUiLanguage] = useState<'en' | 'ja' | 'zh'>('en')

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
            <div className="container mx-auto px-4 py-8 max-w-2xl">
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
                />
                <ResultDisplay
                    error={error}
                    outputText={outputText}
                    copied={copied}
                    copyToClipboard={copyToClipboard}
                    speakText={speakText}
                    activeTab={activeTab}
                    toLang={toLang}
                    uiLanguage={uiLanguage}
                />
                {history.length > 0 && (
                    <HistorySection
                        history={history}
                        clearHistory={clearHistory}
                        conversionStats={conversionStats}
                        uiLanguage={uiLanguage}
                    />
                )}
            </div>
        </AppErrorBoundary>
    )
}
