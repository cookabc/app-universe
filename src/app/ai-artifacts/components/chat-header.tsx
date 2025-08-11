import { Download } from 'lucide-react'

interface ChatHeaderProps {
    exportChat: () => void
    hasMessages: boolean
}

export default function ChatHeader({ exportChat, hasMessages }: ChatHeaderProps) {
    return (
        <header className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-foreground">AI Artifacts Demo</h1>
            {hasMessages && (
                <button
                    type="button"
                    onClick={exportChat}
                    className="p-2 bg-card rounded-full shadow-md hover:bg-muted transition-colors"
                    aria-label="Export chat"
                >
                    <Download className="w-5 h-5 text-muted-foreground" />
                </button>
            )}
        </header>
    )
}
