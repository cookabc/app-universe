'use client'

import { useState } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { ConverterForm } from './components/converter-form'
import { HistorySection } from './components/history-section'
import { useLanguageConverter } from './hooks/useLanguageConverter'
import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'

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
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center mb-8 space-y-4"
                    >
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                            <Languages className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Global Translator
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Break language barriers with our smart translation engine.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                        {/* Main Translation Area */}
                        <div className="lg:col-span-8">
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
                        </div>

                        {/* Sidebar / History */}
                        <div className="lg:col-span-4">
                            {history.length > 0 && (
                                <HistorySection
                                    history={history}
                                    clearHistory={clearHistory}
                                    conversionStats={conversionStats}
                                    uiLanguage={uiLanguage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppErrorBoundary>
    )
}
