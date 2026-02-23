import { ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { languages } from '../constants'

interface ConverterFormProps {
    activeTab: string
    setActiveTab: (value: string) => void
    fromLang: string
    setFromLang: (value: string) => void
    toLang: string
    setToLang: (value: string) => void
    fromType: string
    setFromType: (value: string) => void
    toType: string
    setToType: (value: string) => void
    switchLanguages: () => void
    inputText: string
    setInputText: (value: string) => void
    convertText: () => void
    isLoading: boolean
    uiLanguage: 'en' | 'ja' | 'zh'
}

export function ConverterForm({
    activeTab,
    setActiveTab,
    fromLang,
    setFromLang,
    toLang,
    setToLang,
    fromType,
    setFromType,
    toType,
    setToType,
    switchLanguages,
    inputText,
    setInputText,
    convertText,
    isLoading,
    uiLanguage,
}: ConverterFormProps) {
    return (
        <div className="bg-card rounded-lg shadow-lg p-6 mb-8 border-4 border-primary">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="translation">{languages[uiLanguage].tabs.translation}</TabsTrigger>
                    <TabsTrigger value="japaneseConversion">
                        {languages[uiLanguage].tabs.japaneseConversion}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="translation">
                    <div className="flex justify-between items-center mb-4">
                        <Select value={fromLang} onValueChange={setFromLang}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="From" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages[uiLanguage].languageOptions.map((lang) => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={switchLanguages}
                                    aria-label={languages[uiLanguage].swap}
                                >
                                    <ArrowLeftRight className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{languages[uiLanguage].swap}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Select value={toLang} onValueChange={setToLang}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="To" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages[uiLanguage].languageOptions.map((lang) => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>
                <TabsContent value="japaneseConversion">
                    <div className="flex justify-between items-center mb-4">
                        <Select value={fromType} onValueChange={setFromType}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="From" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages[uiLanguage].japaneseOptions.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={switchLanguages}
                                    aria-label={languages[uiLanguage].swap}
                                >
                                    <ArrowLeftRight className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{languages[uiLanguage].swap}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Select value={toType} onValueChange={setToType}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="To" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages[uiLanguage].japaneseOptions.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>
            </Tabs>

            <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={languages[uiLanguage].inputPlaceholder}
                className="w-full mb-4 text-lg"
                rows={4}
            />

            <Button
                onClick={convertText}
                disabled={isLoading || !inputText.trim()}
                className="w-full mb-4 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                aria-busy={isLoading}
                aria-live="polite"
            >
                {isLoading ? languages[uiLanguage].loading : languages[uiLanguage].convertButton}
            </Button>
        </div>
    )
}
