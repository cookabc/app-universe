'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import html2canvas from 'html2canvas'
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    CalendarDays,
    Download,
    Italic,
    Pencil,
    Underline,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const GRADIENTS = [
    'bg-linear-to-br from-blue-600 to-purple-600',
    'bg-linear-to-br from-green-400 to-green-600',
    'bg-linear-to-br from-orange-300 to-rose-300',
    'bg-linear-to-br from-purple-600 to-blue-800',
    'bg-linear-to-br from-cyan-400 to-blue-500',
    'bg-linear-to-br from-yellow-400 to-orange-500',
    'bg-linear-to-br from-pink-500 to-purple-500',
    'bg-linear-to-br from-teal-400 to-emerald-500',
]

const TEMPLATES = [
    { id: 'modern', name: '现代', bg: 'bg-[#293845]', textColor: 'text-white' },
    { id: 'minimal', name: '简约', bg: 'bg-white/90', textColor: 'text-[#293845]' },
    { id: 'ticket', name: '登机牌', bg: 'bg-white/90', textColor: 'text-[#293845]' },
]

const LANGUAGES: Record<string, any> = {
    zh: {
        title: '艺术中的设计',
        content:
            '艺术中的设计是对创造性流动中各种事物、各种元素之间关系的认识。\n\n你不能发明一个设计。\n你在第四维度中认识它。\n\n也就是说，用你的血液和骨骼，以及你的眼睛来认识它。',
        author: 'D. H. 劳伦斯',
        madeBy: '{name} 制作',
        words: '字数',
        edit: '编辑',
        download: '下载',
        editAndSettings: '编辑与设置',
        date: '日期',
        maker: '制作者',
        titlePlaceholder: '标题',
        contentPlaceholder: '内容',
        authorPlaceholder: '作者',
        fontColor: '字体颜色',
        fontSize: '字体大小',
        fontStyle: '字体样式',
        alignment: '对齐',
        lineHeight: '行高',
        cardContent: '卡片内容',
        styleSettings: '样式设置',
        generalSettings: '常规设置',
    },
    en: {
        title: 'Design in art',
        content:
            "Design in art, is a recognition of the relation between various things, various elements in the creative flux. \n\nYou can't invent a design. \nYou recognize it, in the fourth dimension. \n\nThat is, with your blood and your bones, as well as with your eyes.",
        author: 'D. H. Lawrence',
        madeBy: 'Made by {name}',
        words: 'Words',
        edit: 'Edit',
        download: 'Download',
        editAndSettings: 'Edit & Settings',
        date: 'Date',
        maker: 'Maker',
        titlePlaceholder: 'Title',
        contentPlaceholder: 'Content',
        authorPlaceholder: 'Author',
        fontColor: 'Font Color',
        fontSize: 'Font Size',
        fontStyle: 'Font Style',
        alignment: 'Alignment',
        lineHeight: 'Line Height',
        cardContent: 'Card Content',
        styleSettings: 'Style Settings',
        generalSettings: 'General Settings',
    },
}

const DEFAULT_TITLE_STYLE = {
    fontSize: '32px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
}

const DEFAULT_CONTENT_STYLE = {
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    lineHeight: '1.5',
}

export default function ShareCard() {
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

    useEffect(() => {
        updateWordCount()
    }, [content, lang])

    useEffect(() => {
        setTitle(t.title)
        setContent(t.content)
        setAuthor(t.author)
        updateWordCount()
    }, [lang, t])

    const updateWordCount = () => {
        const isChinese = lang === 'zh'
        const words = isChinese ? content.trim().length : content.trim().split(/\s+/)
        setWordCount(isChinese ? words : words.length)
    }

    const handleContentChange = (text: string) => {
        setContent(text)
        updateWordCount()
    }

    function getCurrentDate() {
        const now = new Date()
        return now.toISOString().split('T')[0]
    }

    const renderContentSection = () => (
        <div className="h-full flex flex-col relative p-6">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-4 h-4" />
                    <div className="text-sm opacity-80">{date}</div>
                </div>
                <h2 style={{ ...titleStyle, textAlign: 'left' }} className="mb-8">
                    {title}
                </h2>
                <div style={{ ...contentStyle, textAlign: 'left', whiteSpace: 'pre-wrap' }}>{content}</div>
            </div>

            <div className="py-4">
                <div className="text-sm font-medium">{author}</div>
            </div>

            <div className="flex justify-between items-center text-xs">
                <span>
                    {t.words}: {wordCount}
                </span>
                <span>{t.madeBy.replace('{name}', madeBy)}</span>
            </div>
        </div>
    )

    const renderBaseCard = () => (
        <div
            className={cn(
                'w-full h-full backdrop-blur-xs rounded-xl border-white/20 overflow-hidden relative',
                selectedTemplate.bg,
                selectedTemplate.textColor,
            )}
        >
            {renderContentSection()}
        </div>
    )

    const renderTicketCard = () => (
        <div
            className={cn(
                'w-full h-full backdrop-blur-xs rounded-xl overflow-hidden relative',
                selectedTemplate.bg,
                selectedTemplate.textColor,
            )}
            style={{
                maskImage: `radial-gradient(circle at left 25%, transparent 16px, black 16px),
                            radial-gradient(circle at left 75%, transparent 16px, black 16px),
                            radial-gradient(circle at right 25%, transparent 16px, black 16px),
                            radial-gradient(circle at right 75%, transparent 16px, black 16px)`,
                maskComposite: 'source-in',
                WebkitMaskImage: `radial-gradient(circle at left 25%, transparent 16px, black 16px),
                                radial-gradient(circle at left 75%, transparent 16px, black 16px),
                                radial-gradient(circle at right 25%, transparent 16px, black 16px),
                                radial-gradient(circle at right 75%, transparent 16px, black 16px)`,
                WebkitMaskComposite: 'source-in',
            }}
        >
            {renderContentSection()}
            <div className="absolute top-[25%] left-0 right-0 border-t border-dashed border-gray-400" />
            <div className="absolute top-[75%] left-0 right-0 border-t border-dashed border-gray-400" />
        </div>
    )

    const renderCard = () => {
        const cardContent = selectedTemplate.id === 'ticket' ? renderTicketCard() : renderBaseCard()
        return <div className={cn('w-full aspect-3/4 p-12', selectedGradient)}>{cardContent}</div>
    }

    const downloadImage = () => {
        if (!cardRef.current) return
        html2canvas(cardRef.current).then((canvas) => {
            const link = document.createElement('a')
            link.download = 'card.png'
            link.href = canvas.toDataURL()
            link.click()
        })
    }

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
        setContentStyle(toggleMap[style]())
    }

    const handleAlignmentChange = (value: string) => {
        setTitleStyle({ ...titleStyle, textAlign: value })
        setContentStyle({ ...contentStyle, textAlign: value })
    }

    return (
        <div className="min-h-screen bg-white text-black p-4">
            <div className="max-w-md mx-auto space-y-4">
                <div className="flex justify-between items-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Pencil className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-gray-200 text-black max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{t.editAndSettings}</DialogTitle>
                            </DialogHeader>
                            <Tabs defaultValue="content" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="content">{t.cardContent}</TabsTrigger>
                                    <TabsTrigger value="style">{t.styleSettings}</TabsTrigger>
                                    <TabsTrigger value="general">{t.generalSettings}</TabsTrigger>
                                </TabsList>
                                <TabsContent value="content" className="space-y-4">
                                    <div>
                                        <Input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder={t.titlePlaceholder}
                                            className="border-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            value={content}
                                            onChange={(e) => handleContentChange(e.target.value)}
                                            placeholder={t.contentPlaceholder}
                                            className="border-gray-300"
                                            rows={4}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            placeholder={t.authorPlaceholder}
                                            className="border-gray-300"
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="style" className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600">{t.fontSize}</label>
                                        <div className="flex gap-2 mt-1">
                                            <Slider
                                                min={12}
                                                max={48}
                                                step={1}
                                                value={[parseInt(titleStyle.fontSize)]}
                                                onValueChange={(value) =>
                                                    setTitleStyle({ ...titleStyle, fontSize: `${value[0]}px` })
                                                }
                                                className="w-1/2"
                                            />
                                            <Slider
                                                min={12}
                                                max={48}
                                                step={1}
                                                value={[parseInt(contentStyle.fontSize)]}
                                                onValueChange={(value) =>
                                                    setContentStyle({ ...contentStyle, fontSize: `${value[0]}px` })
                                                }
                                                className="w-1/2"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">{t.fontStyle}</label>
                                        <ToggleGroup type="multiple" className="justify-start mt-1">
                                            <ToggleGroupItem
                                                value="bold"
                                                aria-label="Toggle bold"
                                                onClick={() => handleFontStyleToggle('bold')}
                                            >
                                                <Bold className="h-4 w-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                value="italic"
                                                aria-label="Toggle italic"
                                                onClick={() => handleFontStyleToggle('italic')}
                                            >
                                                <Italic className="h-4 w-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                value="underline"
                                                aria-label="Toggle underline"
                                                onClick={() => handleFontStyleToggle('underline')}
                                            >
                                                <Underline className="h-4 w-4" />
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">{t.alignment}</label>
                                        <ToggleGroup
                                            type="single"
                                            value={contentStyle.textAlign}
                                            onValueChange={handleAlignmentChange}
                                            className="justify-start mt-1"
                                        >
                                            <ToggleGroupItem value="left" aria-label="Align left">
                                                <AlignLeft className="h-4 w-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="center" aria-label="Align center">
                                                <AlignCenter className="h-4 w-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="right" aria-label="Align right">
                                                <AlignRight className="h-4 w-4" />
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">{t.lineHeight}</label>
                                        <Slider
                                            min={1}
                                            max={2}
                                            step={0.1}
                                            value={[parseFloat(contentStyle.lineHeight)]}
                                            onValueChange={(value) =>
                                                setContentStyle({ ...contentStyle, lineHeight: value[0].toString() })
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="general" className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600">{t.date}</label>
                                        <Input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="border-gray-300 mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">{t.maker}</label>
                                        <Input
                                            value={madeBy}
                                            onChange={(e) => setMadeBy(e.target.value)}
                                            className="border-gray-300 mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Language</label>
                                        <Select value={lang} onValueChange={setLang}>
                                            <SelectTrigger className="border-gray-300 mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="zh">中文</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="icon" onClick={downloadImage}>
                        <Download className="w-5 h-5" />
                    </Button>
                </div>

                <div ref={cardRef}>{renderCard()}</div>

                <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
                    <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                        <div className="p-4 space-y-4">
                            <div className="flex gap-4 text-sm text-gray-600">
                                {TEMPLATES.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template)}
                                        className={cn(
                                            'hover:text-black transition-colors',
                                            selectedTemplate.id === template.id && 'text-black',
                                        )}
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {GRADIENTS.map((gradient, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedGradient(gradient)}
                                        className={cn(
                                            'w-8 h-8 rounded-full',
                                            gradient,
                                            selectedGradient === gradient &&
                                                'ring-2 ring-black ring-offset-2 ring-offset-white',
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
