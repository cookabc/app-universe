import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TEMPLATES, GRADIENTS } from '../constants'

interface StyleControlsProps {
    selectedTemplate: any
    setSelectedTemplate: (template: any) => void
    selectedGradient: string
    setSelectedGradient: (gradient: string) => void
}

export function StyleControls({ selectedTemplate, setSelectedTemplate, selectedGradient, setSelectedGradient }: StyleControlsProps) {
    return (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm border-border">
                <div className="p-4 space-y-4">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        {TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                className={cn(
                                    'hover:text-foreground transition-colors',
                                    selectedTemplate?.id === template.id && 'text-foreground',
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
                                    selectedGradient === gradient && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
                                )}
                            />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )
}
