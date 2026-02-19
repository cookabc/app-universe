import { Copy, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'

interface ImageGeneratorFormProps {
    prompt: string
    setPrompt: (prompt: string) => void
    negativePrompt: string
    setNegativePrompt: (prompt: string) => void
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 />
                    Image Generator
                </CardTitle>
                <CardDescription>Create stunning images from text prompts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="prompt">Prompt</Label>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={handleCopyPrompt} aria-label="Copy prompt">
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Copy prompt</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <Textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A majestic lion in a futuristic city..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="negative-prompt">Negative Prompt</Label>
                    <Input
                        id="negative-prompt"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="ugly, blurry, bad quality"
                    />
                </div>
                <Button onClick={onSubmit} disabled={isLoading} className="w-full">
                    {isLoading ? 'Generating...' : 'Generate'}
                </Button>
            </CardContent>
        </Card>
    )
}
