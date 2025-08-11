import { cn } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'

interface CardPreviewProps {
    selectedTemplate: any
    selectedGradient: string
    title: string
    content: string
    author: string
    date: string
    madeBy: string
    wordCount: number
    titleStyle: any
    contentStyle: any
    t: any
}

export function CardPreview({
    selectedTemplate,
    selectedGradient,
    title,
    content,
    author,
    date,
    madeBy,
    wordCount,
    titleStyle,
    contentStyle,
    t,
}: CardPreviewProps) {
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
                selectedTemplate?.bg,
                selectedTemplate?.textColor,
            )}
        >
            {renderContentSection()}
        </div>
    )

    const renderTicketCard = () => (
        <div
            className={cn(
                'w-full h-full backdrop-blur-xs rounded-xl overflow-hidden relative',
                selectedTemplate?.bg,
                selectedTemplate?.textColor,
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

    const cardContent = selectedTemplate?.id === 'ticket' ? renderTicketCard() : renderBaseCard()
    return <div className={cn('w-full aspect-3/4 p-12', selectedGradient)}>{cardContent}</div>
}
