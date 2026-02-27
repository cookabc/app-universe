import { Copy, Wand2, Settings2, Sliders } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface ImageGeneratorFormProps {
    prompt: string
    setPrompt: (value: string) => void
    negativePrompt: string
    setNegativePrompt: (value: string) => void
    isLoading: boolean
    onSubmit: () => void
}

export function ImageGeneratorForm({
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    isLoading,
    onSubmit,
}: ImageGeneratorFormProps) {
    const { toast } = useToast()

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(prompt)
        toast({
            title: 'Prompt copied!',
            description: 'The prompt has been copied to your clipboard.',
        })
    }

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Wand2 className="w-5 h-5 text-primary" />
                    Generation Controls
                </CardTitle>
                <CardDescription>Configure your image parameters</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="prompt" className="text-sm font-medium">
                                    Prompt
                                </Label>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-primary"
                                    onClick={handleCopyPrompt}
                                >
                                    <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                            <Textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your imagination... (e.g., A futuristic cyberpunk city with neon lights)"
                                className="min-h-[140px] resize-none bg-background/50 focus:bg-background transition-colors text-base p-4 rounded-xl border-primary/20 focus:border-primary/50"
                            />
                        </div>

                        <Button
                            onClick={onSubmit}
                            disabled={isLoading}
                            className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span> Generating...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Wand2 className="w-5 h-5" /> Generate Image
                                </div>
                            )}
                        </Button>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="negative-prompt" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Sliders className="w-3 h-3" /> Negative Prompt
                            </Label>
                            <Textarea
                                id="negative-prompt"
                                value={negativePrompt}
                                onChange={(e) => setNegativePrompt(e.target.value)}
                                placeholder="what to exclude (e.g., blurry, ugly, bad anatomy)"
                                className="min-h-[100px] bg-background/50 resize-none text-sm"
                            />
                        </div>

                        <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 mb-2">
                                <Settings2 className="w-4 h-4" />
                                <span className="font-medium">Model Settings</span>
                            </div>
                            <p className="text-xs">
                                Advanced parameters like Steps, CFG Scale, and Seed will be available in the next update.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
