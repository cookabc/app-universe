import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { languages } from '../constants'

interface HistorySectionProps {
    history: Array<{
        id: string
        input: string
        output: string
        from: string
        to: string
        mode: string
    }>
    clearHistory: () => void
    conversionStats: {
        totalConversions: number
        translationCount: number
        japaneseCount: number
    }
    uiLanguage: 'en' | 'ja' | 'zh'
}

export function HistorySection({
    history,
    clearHistory,
    conversionStats,
    uiLanguage,
}: HistorySectionProps) {
    return (
        <div className="bg-card rounded-lg shadow-lg p-6 border-4 border-primary">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold font-bangers text-foreground">{languages[uiLanguage].history}</h2>
                <Button variant="outline" size="sm" onClick={clearHistory} aria-label="Clear history">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {languages[uiLanguage].clearHistory}
                </Button>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
                Total: {conversionStats.totalConversions} | Translations: {conversionStats.translationCount} | Japanese:
                {conversionStats.japaneseCount}
            </div>
            <ul className="space-y-2">
                {history.map((item) => (
                    <li key={item.id} className="bg-muted p-2 rounded">
                        <p className="font-medium text-foreground">
                            {item.input} ({item.from} to {item.to})
                        </p>
                        <p className="text-sm text-muted-foreground">{item.output}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {item.mode === 'translation'
                                ? languages[uiLanguage].tabs.translation
                                : languages[uiLanguage].tabs.japaneseConversion}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
