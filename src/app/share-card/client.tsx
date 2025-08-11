'use client'

import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { Button } from '@/components/ui/button'
import { CardPreview } from './components/card-preview'
import { EditDialog } from './components/edit-dialog'
import { StyleControls } from './components/style-controls'
import { GRADIENTS, TEMPLATES, LANGUAGES, DEFAULT_TITLE_STYLE, DEFAULT_CONTENT_STYLE } from './constants'

function getCurrentDate() {
    const now = new Date()
    return now.toISOString().split('T')[0]
}

export default function ShareCardClient() {
    const [lang, setLang] = useState('zh')
    const t = LANGUAGES[lang]

    const [title, setTitle] = useState(t.title)
    const [content, setContent] = useState(t.content)
    const [author, setAuthor] = useState(t.author)
    const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0])
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0])
    const [wordCount, setWordCount] = useState(0)
    const [date, setDate] = useState(getCurrentDate())
    const [madeBy, setMadeBy] = useState('Anata')

    const [titleStyle, setTitleStyle] = useState(DEFAULT_TITLE_STYLE)
    const [contentStyle, setContentStyle] = useState(DEFAULT_CONTENT_STYLE)

    const cardRef = useRef<HTMLDivElement>(null)

    const [isPending, startTransition] = useTransition()

    const cardStats = useMemo(
        () => ({
            totalCharacters: title.length + content.length + author.length,
            templateName: selectedTemplate?.name ?? '',
        }),
        [title, content, author, selectedTemplate],
    )

    const updateWordCount = useCallback(() => {
        const isChinese = lang === 'zh'
        const words = isChinese ? content.trim().length : content.trim().split(/\s+/)
        setWordCount(isChinese ? words : words.length)
    }, [lang, content])

    useEffect(() => {
        updateWordCount()
    }, [updateWordCount])

    useEffect(() => {
        setTitle(t.title)
        setContent(t.content)
        setAuthor(t.author)
    }, [t])

    const handleContentChange = (text: string) => {
        setContent(text)
    }

    const downloadImage = useCallback(() => {
        if (!cardRef.current) return

        startTransition(() => {
            html2canvas(cardRef.current!)
                .then((canvas) => {
                    const link = document.createElement('a')
                    link.download = `card-${Date.now()}.png`
                    link.href = canvas.toDataURL('image/png', 1.0)
                    link.click()
                })
                .catch((error) => {
                    console.error('Failed to generate image:', error)
                })
        })
    }, [])

    const toggleMap: Record<string, () => typeof contentStyle> = {
        bold: () => ({
            ...contentStyle,
            fontWeight: contentStyle.fontWeight === 'bold' ? 'normal' : 'bold',
        }),
        italic: () => ({
            ...contentStyle,
            fontStyle: contentStyle.fontStyle === 'italic' ? 'normal' : 'italic',
        }),
        underline: () => ({
            ...contentStyle,
            textDecoration: contentStyle.textDecoration === 'underline' ? 'none' : 'underline',
        }),
    }

    const handleFontStyleToggle = (style: string) => {
        if (toggleMap[style]) {
            setContentStyle(toggleMap[style]())
        }
    }

    const handleAlignmentChange = (value: string) => {
        setTitleStyle({ ...titleStyle, textAlign: value })
        setContentStyle({ ...contentStyle, textAlign: value })
    }

    return (
        <AppErrorBoundary>
            <div className="min-h-screen bg-background text-foreground p-4">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="flex justify-between items-center">
                        <EditDialog
                            t={t}
                            title={title}
                            setTitle={setTitle}
                            content={content}
                            handleContentChange={handleContentChange}
                            author={author}
                            setAuthor={setAuthor}
                            titleStyle={titleStyle}
                            setTitleStyle={setTitleStyle}
                            contentStyle={contentStyle}
                            setContentStyle={setContentStyle}
                            handleFontStyleToggle={handleFontStyleToggle}
                            handleAlignmentChange={handleAlignmentChange}
                            date={date}
                            setDate={setDate}
                            madeBy={madeBy}
                            setMadeBy={setMadeBy}
                            lang={lang}
                            setLang={setLang}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={downloadImage}
                            disabled={isPending}
                            aria-busy={isPending}
                            aria-label={isPending ? 'Generating image' : 'Download image'}
                        >
                            <Download className="w-5 h-5" />
                        </Button>

                        <div className="text-xs text-muted-foreground">
                            {cardStats.totalCharacters} 字符 | 模板: {cardStats.templateName}
                        </div>
                    </div>

                    <div ref={cardRef}>
                        <CardPreview
                            selectedTemplate={selectedTemplate}
                            selectedGradient={selectedGradient}
                            title={title}
                            content={content}
                            author={author}
                            date={date}
                            madeBy={madeBy}
                            wordCount={wordCount}
                            titleStyle={titleStyle}
                            contentStyle={contentStyle}
                            t={t}
                        />
                    </div>

                    <StyleControls
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                        selectedGradient={selectedGradient}
                        setSelectedGradient={setSelectedGradient}
                    />
                </div>
            </div>
        </AppErrorBoundary>
    )
}
