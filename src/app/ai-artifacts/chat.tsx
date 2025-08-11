'use client'

import { useEffect, useMemo, useOptimistic, useState, useTransition } from 'react'
import { continueConversation, type Message } from '@/app/actions'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import ChatHeader from './components/chat-header'
import MessageList from './components/message-list'
import ChatInput from './components/chat-input'

const WELCOME_MESSAGE: Message = {
    role: 'assistant',
    content: 'Welcome to AI Artifacts Demo! How can I assist you today?',
}

export default function Chat() {
    const [input, setInput] = useState<string>('')
    const [conversation, setConversation] = useState<Message[]>([WELCOME_MESSAGE])
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

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

    useEffect(() => {
        try {
            localStorage.setItem('chatMessages', JSON.stringify(conversation))
        } catch (err) {
            console.error('Failed to save messages to localStorage:', err)
        }
    }, [conversation])

    useEffect(() => {
        try {
            const savedMessages = localStorage.getItem('chatMessages')
            if (savedMessages) {
                setConversation(JSON.parse(savedMessages))
            } else {
                setConversation([WELCOME_MESSAGE])
            }
        } catch (err) {
            console.error('Failed to load messages from localStorage:', err)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = { role: 'user', content: input }

        addOptimisticMessage(userMessage)

        setInput('')
        setError(null)

        startTransition(async () => {
            try {
                const { messages, replyText } = await continueConversation([...conversation, userMessage])
                setConversation([...messages, { role: 'assistant', content: replyText }])
            } catch (err) {
                console.error('Error in conversation:', err)
                if (err instanceof Error) {
                    setError(`An error occurred: ${err.message}. Please try again.`)
                } else {
                    setError('An unexpected error occurred while processing your request. Please try again.')
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
                    <ChatHeader exportChat={exportChat} hasMessages={conversation.length > 0} />
                    <div className="grow overflow-auto mb-4 space-y-4">
                        <div className="text-xs text-muted-foreground mb-2">
                            Messages: {conversationStats.totalMessages} | Avg length: {' '}
                            {conversationStats.averageMessageLength} chars
                        </div>
                        <MessageList messages={optimisticMessages} />
                    </div>
                    {error && <div className="text-destructive mb-4">{error}</div>}
                    <ChatInput input={input} setInput={setInput} handleSubmit={handleSubmit} isPending={isPending} />
                </div>
            </div>
        </AppErrorBoundary>
    )
}
