'use client'

import { useEffect, useMemo, useOptimistic, useState, useTransition } from 'react'
import { createArtifact, getArtifacts, continueConversation, type Message } from '@/app/actions'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { useUser } from '@clerk/nextjs'

const WELCOME_MESSAGE: Message = {
    role: 'assistant',
    content: 'Welcome to AI Artifacts Demo! How can I assist you today?',
}

export default function Chat() {
    const { user } = useUser();
    const [input, setInput] = useState<string>('')
    const [conversation, setConversation] = useState<Message[]>([WELCOME_MESSAGE])
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            getArtifacts().then((artifacts) => {
                if (artifacts.length > 0) {
                    setConversation(artifacts.map(a => ({ role: a.role, content: a.content } as Message)));
                }
            });
        }
    }, [user]);

    const [optimisticMessages, addOptimisticMessage] = useOptimistic(conversation, (current, newMessage: Message) => [
        ...current,
        newMessage,
    ])

    const conversationStats = useMemo(
        () => ({
            totalMessages: conversation.length,
            userMessages: conversation.filter((m) => m.role === 'user').length,
            assistantMessages: conversation.filter((m) => m.role === 'assistant').length,
            averageMessageLength:
                conversation.length > 0
                    ? Math.round(conversation.reduce((acc, m) => acc + m.content.length, 0) / conversation.length)
                    : 0,
        }),
        [conversation],
    )

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = { role: 'user', content: input }

        addOptimisticMessage(userMessage)

        setInput('')
        setError(null)

        startTransition(async () => {
            try {
                await createArtifact(userMessage.content, 'user');
                const { messages, replyText } = await continueConversation([...conversation, userMessage])
                setConversation([...messages, { role: 'assistant', content: replyText }])
                await createArtifact(replyText, 'assistant');
            } catch (err) {
                console.error('Error in conversation:', err)
                if (err instanceof Error) {
                    setError(`An error occurred: ${err.message}. Please try again.`);
                } else {
                    setError('An unexpected error occurred while processing your request. Please try again.');
                }
                setConversation((prev) => prev.filter((m) => m !== userMessage))
            }
        })
    }

    const exportChat = () => {
        const chatContent = conversation.map((m) => `${m.role}: ${m.content}`).join('\n\n')
        const blob = new Blob([chatContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'chat_export.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <AppErrorBoundary>
            <div className="flex flex-col h-screen bg-background p-4 sm:p-6">
                <div className="max-w-3xl w-full mx-auto flex flex-col grow">
                    <h2 className="text-xl font-bold mb-4">AI Artifacts Chat</h2>
                    <div className="grow overflow-auto mb-4 space-y-4 p-2 border rounded-md">
                        {optimisticMessages.map((msg, index) => (
                            <div key={index} className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-blue-100 text-blue-800 self-end' : 'bg-gray-100 text-gray-800 self-start'}`}>
                                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
                            </div>
                        ))}
                    </div>
                    {error && <div className="text-destructive mb-4">{error}</div>}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <textarea
                            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            rows={3}
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            disabled={isPending || !input.trim()}
                        >
                            {isPending ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </AppErrorBoundary>
    )
}
