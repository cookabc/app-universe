'use client'

import { useCallback, useEffect, useMemo, useOptimistic, useState, useTransition } from 'react'
import { getCachedTranslation, japaneseConvert } from '@/app/actions'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { ConverterForm } from './components/converter-form'
import { HistorySection } from './components/history-section'
import { ResultDisplay } from './components/result-display'
import { languages } from './constants'

const speakText = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    window.speechSynthesis.speak(utterance)
}

export default function LangConverterClient() {
    const [inputText, setInputText] = useState('')
    const [outputText, setOutputText] = useState('')
    const [fromLang, setFromLang] = useState('en')
    const [toLang, setToLang] = useState('ja')
    const [fromType, setFromType] = useState('hiragana')
    const [toType, setToType] = useState('romaji')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [history, setHistory] = useState<
        Array<{
            id: string
            input: string
            output: string
            from: string
            to: string
            mode: string
        }>
    >([])
    const [copied, setCopied] = useState(false)
    const [uiLanguage, setUiLanguage] = useState<'en' | 'ja' | 'zh'>('en')
    const [activeTab, setActiveTab] = useState('translation')

    const [_isPending, startTransition] = useTransition()

    const [optimisticHistory, addOptimisticHistory] = useOptimistic(
        history,
        (current, newItem: (typeof history)[0]) => [newItem, ...current.slice(0, 9)],
    )

    const conversionStats = useMemo(
        () => ({
            totalConversions: history.length,
            translationCount: history.filter((h) => h.mode === 'translation').length,
            japaneseCount: history.filter((h) => h.mode === 'japaneseConversion').length,
        }),
        [history],
    )

    useEffect(() => {
        const savedHistory = localStorage.getItem('conversionHistory')
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }, [])

    const convertText = useCallback(async () => {
        if (!inputText.trim()) {
            setError(languages[uiLanguage].inputPlaceholder)
            return
        }

        const newHistoryItem = {
            id: Date.now().toString(),
            input: inputText,
            output: '...',
            from: activeTab === 'translation' ? fromLang : fromType,
            to: activeTab === 'translation' ? toLang : toType,
            mode: activeTab,
        }

        addOptimisticHistory(newHistoryItem)

        setIsLoading(true)
        setError(null)
        setOutputText('')

        try {
            let result: string
            if (activeTab === 'translation') {
                const translationResult = await getCachedTranslation(inputText, fromLang, toLang)
                result = translationResult.success ? translationResult.data! : translationResult.error!
            } else {
                const conversionResult = await japaneseConvert(inputText, fromType, toType)
                result = conversionResult.success ? conversionResult.data! : conversionResult.error!
            }

            setOutputText(result)
            const finalHistoryItem = { ...newHistoryItem, output: result }
            const newHistory = [finalHistoryItem, ...history.slice(0, 9)]
            setHistory(newHistory)
            localStorage.setItem('conversionHistory', JSON.stringify(newHistory))
        } catch (err) {
            console.error('Error details:', err)
            setError(`${languages[uiLanguage].error}: ${err instanceof Error ? err.message : 'Unknown error'}`)
            setHistory((prev) => prev.filter((item) => item.id !== newHistoryItem.id))
        } finally {
            setIsLoading(false)
        }
    }, [inputText, uiLanguage, activeTab, fromLang, toLang, fromType, toType, history, addOptimisticHistory])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(outputText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem('conversionHistory')
    }

    const switchLanguages = () => {
        startTransition(() => {
            if (activeTab === 'translation') {
                setFromLang(toLang)
                setToLang(fromLang)
            } else {
                setFromType(toType)
                setToType(fromType)
            }
        })
    }

    return (
        <AppErrorBoundary>
            <div className="container mx-auto p-4 max-w-2xl">
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
                        history={optimisticHistory}
                        clearHistory={clearHistory}
                        conversionStats={conversionStats}
                        uiLanguage={uiLanguage}
                    />
                )}
            </div>
        </AppErrorBoundary>
    )
}
