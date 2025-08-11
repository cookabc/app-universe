import { Loader2, Send } from 'lucide-react'

interface ChatInputProps {
    input: string
    setInput: (value: string) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isPending: boolean
}

export default function ChatInput({ input, setInput, handleSubmit, isPending }: ChatInputProps) {
    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e as any) // This will be fixed in the main component
                    }
                }}
                placeholder="Type your message..."
                className="grow p-2 rounded-full border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isPending}
            />
            <button
                type="submit"
                disabled={isPending}
                className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            >
                {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </button>
        </form>
    )
}
