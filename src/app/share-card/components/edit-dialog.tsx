import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react'

interface EditDialogProps {
    t: any
    title: string
    setTitle: (value: string) => void
    content: string
    handleContentChange: (value: string) => void
    author: string
    setAuthor: (value: string) => void
    titleStyle: any
    setTitleStyle: (value: any) => void
    contentStyle: any
    setContentStyle: (value: any) => void
    handleFontStyleToggle: (value: string) => void
    handleAlignmentChange: (value: string) => void
    date: string
    setDate: (value: string) => void
    madeBy: string
    setMadeBy: (value: string) => void
    lang: string
    setLang: (value: string) => void
}

export function EditDialog({ t, title, setTitle, content, handleContentChange, author, setAuthor, titleStyle, setTitleStyle, contentStyle, setContentStyle, handleFontStyleToggle, handleAlignmentChange, date, setDate, madeBy, setMadeBy, lang, setLang }: EditDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pencil className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border text-foreground max-w-3xl max-h-[80vh] overflow-y-auto">
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
                                className="border-border"
                            />
                        </div>
                        <div>
                            <Textarea
                                value={content}
                                onChange={(e) => handleContentChange(e.target.value)}
                                placeholder={t.contentPlaceholder}
                                className="border-border"
                                rows={4}
                            />
                        </div>
                        <div>
                            <Input
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder={t.authorPlaceholder}
                                className="border-border"
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="style" className="space-y-4">
                        <div>
                            <label className="text-sm text-muted-foreground">{t.fontSize}</label>
                            <div className="flex gap-2 mt-1">
                                <Slider
                                    min={12}
                                    max={48}
                                    step={1}
                                    value={[parseInt(titleStyle.fontSize)]}
                                    onValueChange={(value) =>
                                        setTitleStyle({
                                            ...titleStyle,
                                            fontSize: `${value[0]}px`,
                                        })
                                    }
                                    className="w-1/2"
                                />
                                <Slider
                                    min={12}
                                    max={48}
                                    step={1}
                                    value={[parseInt(contentStyle.fontSize)]}
                                    onValueChange={(value) =>
                                        setContentStyle({
                                            ...contentStyle,
                                            fontSize: `${value[0]}px`,
                                        })
                                    }
                                    className="w-1/2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">{t.fontStyle}</label>
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
                            <label className="text-sm text-muted-foreground">{t.alignment}</label>
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
                            <label className="text-sm text-muted-foreground">{t.lineHeight}</label>
                            <Slider
                                min={1}
                                max={2}
                                step={0.1}
                                value={[parseFloat(contentStyle.lineHeight)]}
                                onValueChange={(value) =>
                                    setContentStyle({
                                        ...contentStyle,
                                        lineHeight: (value?.[0] ?? contentStyle.lineHeight).toString(),
                                    })
                                }
                                className="mt-1"
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="general" className="space-y-4">
                        <div>
                            <label className="text-sm text-muted-foreground">{t.date}</label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border-border mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">{t.maker}</label>
                            <Input
                                value={madeBy}
                                onChange={(e) => setMadeBy(e.target.value)}
                                className="border-border mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Language</label>
                            <Select value={lang} onValueChange={setLang}>
                                <SelectTrigger className="border-border mt-1">
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
    )
}
