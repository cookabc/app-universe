'use server'

import { openai } from '@ai-sdk/openai'
import { generateObject, streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import { revalidateTag, unstable_cache } from 'next/cache'
import { z } from 'zod'

// Enhanced error handling for Next.js 15
class ActionError extends Error {
    constructor(
        message: string,
        public code?: string,
    ) {
        super(message)
        this.name = 'ActionError'
    }
}

const questionSchema = z.object({
    id: z.number(),
    text: z.string(),
    type: z.enum(['EI', 'SN', 'TF', 'JP']),
    options: z.array(z.string()).length(2),
})

const questionsSchema = z.object({
    questions: z.array(questionSchema),
})

export async function getQuestions(prompt: string) {
    try {
        if (!prompt?.trim()) {
            throw new ActionError('Prompt is required', 'INVALID_INPUT')
        }

        const { object: questions } = await generateObject({
            model: openai('gpt-4o-mini'),
            prompt,
            schema: questionsSchema,
        })

        return { success: true, data: questions }
    } catch (error) {
        console.error('Error generating questions:', error)
        return {
            success: false,
            error: error instanceof ActionError ? error.message : 'Failed to generate questions',
        }
    }
}

export interface Message {
    role: 'user' | 'assistant'
    content: string
}

export async function continueConversation(history: Message[]) {
    try {
        if (!Array.isArray(history)) {
            throw new ActionError('Invalid message history', 'INVALID_INPUT')
        }

        const stream = createStreamableValue()

        ;(async () => {
            try {
                const { textStream } = await streamText({
                    model: openai('gpt-4o-mini'),
                    system: 'You are a helpful assistant capable of doing anything.',
                    messages: history,
                    maxTokens: 1000,
                    temperature: 0.7,
                })

                for await (const text of textStream) {
                    stream.update(text)
                }

                stream.done()
            } catch (error) {
                console.error('Streaming error:', error)
                stream.error(error instanceof Error ? error.message : 'Streaming failed')
            }
        })()

        return {
            messages: history,
            newMessage: stream.value,
        }
    } catch (error) {
        console.error('Conversation error:', error)
        throw new ActionError(
            error instanceof ActionError ? error.message : 'Failed to continue conversation',
            'CONVERSATION_ERROR',
        )
    }
}

export const translateText = async (
    text: string,
    fromLang: string,
    toLang: string,
): Promise<{ success: boolean; data?: string; error?: string }> => {
    try {
        if (!text?.trim() || !fromLang || !toLang) {
            throw new ActionError('Text, source language, and target language are required', 'INVALID_INPUT')
        }

        // Use Next.js 15 fetch with enhanced caching
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`,
            {
                next: {
                    revalidate: 3600, // Cache for 1 hour
                    tags: [`translation-${fromLang}-${toLang}`],
                },
            },
        )

        if (!response.ok) {
            throw new ActionError(`HTTP error! status: ${response.status}`, 'FETCH_ERROR')
        }

        const data = await response.json()

        if (data.responseStatus === 200) {
            return { success: true, data: data.responseData.translatedText }
        }

        throw new ActionError(data.responseDetails || 'Translation API error', 'API_ERROR')
    } catch (error) {
        console.error('Translation error:', error)
        return {
            success: false,
            error: error instanceof ActionError ? error.message : 'Translation failed',
        }
    }
}

export const japaneseConvert = async (
    text: string,
    fromType: string,
    toType: string,
): Promise<{ success: boolean; data?: string; error?: string }> => {
    try {
        if (!text?.trim() || !fromType || !toType) {
            throw new ActionError('Text, source type, and target type are required', 'INVALID_INPUT')
        }

        const kuroshiro = new Kuroshiro()
        await kuroshiro.init(new KuromojiAnalyzer())

        if (!kuroshiro) {
            throw new ActionError('Kuroshiro not initialized', 'INIT_ERROR')
        }

        let result = text

        if (fromType !== 'kanji' && toType !== 'kanji') {
            result = await kuroshiro.convert(text, {
                to: toType as 'hiragana' | 'katakana' | 'romaji',
            })
        } else if (fromType === 'kanji') {
            result = await kuroshiro.convert(text, {
                to: toType as 'hiragana' | 'katakana' | 'romaji',
            })
        } else {
            // Converting to kanji is not directly supported, so we'll just return the original text
            result = text
        }

        return { success: true, data: result }
    } catch (error) {
        console.error('Japanese conversion error:', error)
        return {
            success: false,
            error: error instanceof ActionError ? error.message : 'Japanese conversion failed',
        }
    }
}

// Enhanced caching with unstable_cache for Next.js 15
export const getCachedTranslation = unstable_cache(
    async (text: string, fromLang: string, toLang: string) => {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`,
            { next: { revalidate: 3600 } },
        )

        if (!response.ok) {
            throw new ActionError(`HTTP error! status: ${response.status}`, 'FETCH_ERROR')
        }

        const data = await response.json()

        if (data.responseStatus === 200) {
            return data.responseData.translatedText
        }

        throw new ActionError(data.responseDetails || 'Translation API error', 'API_ERROR')
    },
    ['translation'],
    {
        revalidate: 3600,
        tags: ['translations'],
    },
)

export const getCachedQuestions = unstable_cache(
    async (prompt: string) => {
        const { object: questions } = await generateObject({
            model: openai('gpt-4o-mini'),
            prompt,
            schema: questionsSchema,
        })
        return questions
    },
    ['questions'],
    {
        revalidate: 1800, // 30 minutes
        tags: ['mbti-questions'],
    },
)

// Cache management utilities for Next.js 15
export async function revalidateTranslations() {
    'use server'
    revalidateTag('translations')
}

export async function revalidateQuestions() {
    'use server'
    revalidateTag('mbti-questions')
}

export async function clearTranslationCache(fromLang: string, toLang: string) {
    'use server'
    revalidateTag(`translation-${fromLang}-${toLang}`)
}
