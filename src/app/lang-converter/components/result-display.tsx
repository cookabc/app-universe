import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, Copy, Volume2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { languages } from '../constants'

interface ResultDisplayProps {
    error: string | null
    outputText: string
    copied: boolean
    copyToClipboard: () => void
    speakText: (text: string, lang: string) => void
    activeTab: string
    toLang: string
    uiLanguage: 'en' | 'ja' | 'zh'
}

export function ResultDisplay({
    error,
    outputText,
    copied,
    copyToClipboard,
    speakText,
    activeTab,
    toLang,
    uiLanguage,
}: ResultDisplayProps) {
    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <Alert variant="destructive" className="mb-4" role="alert" aria-live="assertive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{languages[uiLanguage].error}</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </motion.div>
            )}
            {outputText && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                    <div className="bg-muted p-4 rounded-lg mb-4" role="status" aria-live="polite">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold text-foreground">{languages[uiLanguage].result}</h2>
                            <div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => speakText(outputText, activeTab === 'translation' ? toLang : 'ja')}
                                    className="mr-2"
                                    aria-label="Speak result"
                                >
                                    <Volume2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <p className="text-lg font-bold font-kosugi">{outputText}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
