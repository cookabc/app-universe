'use server'

import { openai } from '@ai-sdk/openai'
import { createStreamableValue } from '@ai-sdk/rsc'
import { generateObject, generateText, streamText } from 'ai'
import { eq } from 'drizzle-orm'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import { revalidateTag, unstable_cache } from 'next/cache'
import { z } from 'zod'
import { db } from '@/db'
import { artifacts, prompts, promptVersions } from '@/db/schema'
import { getUserWithAuth } from '@/hooks/useAuth'
import { AppError, formatErrorResponse, safeAsync, ValidationError } from '@/lib/error-handling'

// Singleton instance for Kuroshiro to avoid re-initialization overhead
let kuroshiroInstance: Kuroshiro | null = null

async function getKuroshiroInstance() {
    if (!kuroshiroInstance) {
        kuroshiroInstance = new Kuroshiro()
        await kuroshiroInstance.init(new KuromojiAnalyzer())
    }
    return kuroshiroInstance
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
    const result = await safeAsync(async () => {
        await getUserWithAuth()

        if (!prompt?.trim()) {
            throw new ValidationError('Prompt is required')
        }

        const { object: questions } = await generateObject({
            model: openai('gpt-4o-mini'),
            prompt,
            schema: questionsSchema,
        })

        return questions
    }, 'getQuestions')

    if (!result.success) {
        return formatErrorResponse(result.error)
    }

    return { success: true, data: result.data }
}

export interface Message {
    role: 'user' | 'assistant'
    content: string
}

export async function continueConversation(history: Message[]) {
    const result = await safeAsync(async () => {
        await getUserWithAuth()

        if (!Array.isArray(history)) {
            throw new ValidationError('Invalid message history')
        }

        const stream = createStreamableValue('')

        ;(async () => {
            try {
                const { textStream } = await streamText({
                    model: openai('gpt-4o-mini'),
                    system: 'You are a helpful assistant capable of doing anything.',
                    messages: history,
                })

                for await (const delta of textStream) {
                    stream.update(delta)
                }

                stream.done()
            } catch (error) {
                stream.error(error)
                stream.done()
            }
        })()

        return {
            messages: history,
            newMessage: stream.value,
        }
    }, 'continueConversation')

    if (!result.success) {
        throw result.error
    }

    return result.data
}

export const translateText = async (
    text: string,
    fromLang: string,
    toLang: string,
): Promise<{ success: boolean; data?: string; error?: string }> => {
    const result = await safeAsync(async () => {
        if (!text?.trim() || !fromLang || !toLang) {
            throw new ValidationError('Text, source language, and target language are required')
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
            throw new AppError(`HTTP error! status: ${response.status}`, 'FETCH_ERROR', response.status)
        }

        const data = await response.json()

        if (data.responseStatus === 200) {
            return data.responseData.translatedText
        } else {
            throw new AppError(data.responseDetails || 'Translation API error', 'API_ERROR', 400)
        }
    }, 'translateText')

    if (!result.success) {
        return {
            success: false,
            error: result.error.message,
        }
    }

    return { success: true, data: result.data }
}

export const japaneseConvert = async (
    text: string,
    fromType: string,
    toType: string,
): Promise<{ success: boolean; data?: string; error?: string }> => {
    const result = await safeAsync(async () => {
        if (!text?.trim() || !fromType || !toType) {
            throw new ValidationError('Text, source type, and target type are required')
        }

        const kuroshiro = await getKuroshiroInstance()

        if (!kuroshiro) {
            throw new AppError('Kuroshiro not initialized', 'INIT_ERROR', 500)
        }

        let result = text

        if (toType !== 'kanji') {
            result = await kuroshiro.convert(text, {
                to: toType as 'hiragana' | 'katakana' | 'romaji',
            })
        } else {
            // Converting to kanji is not directly supported, so we'll just return the original text
            result = text
        }

        return result
    }, 'japaneseConvert')

    if (!result.success) {
        return {
            success: false,
            error: result.error.message,
        }
    }

    return { success: true, data: result.data }
}

// Enhanced caching with unstable_cache for Next.js 15
export const getCachedTranslation = unstable_cache(
    async (text: string, fromLang: string, toLang: string) => {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`,
            { next: { revalidate: 3600 } },
        )

        if (!response.ok) {
            throw new AppError(`HTTP error! status: ${response.status}`, 'FETCH_ERROR', response.status)
        }

        const data = await response.json()

        if (data.responseStatus === 200) {
            return data.responseData.translatedText
        } else {
            throw new AppError(data.responseDetails || 'Translation API error', 'API_ERROR', 400)
        }
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
    // @ts-expect-error - Next.js 16 API change
    revalidateTag('translations')
}

export async function revalidateQuestions() {
    'use server'
    // @ts-expect-error - Next.js 16 API change
    revalidateTag('mbti-questions')
}

export async function clearTranslationCache(fromLang: string, toLang: string) {
    'use server'
    // @ts-expect-error - Next.js 16 API change
    revalidateTag(`translation-${fromLang}-${toLang}`)
}

export async function getArtifacts() {
    const user = await getUserWithAuth()

    return db.query.artifacts.findMany({
        where: eq(artifacts.userId, user.id),
    })
}

export async function createArtifact(content: string, role: 'user' | 'assistant') {
    const user = await getUserWithAuth()

    return db.insert(artifacts).values({
        userId: user.id,
        content,
        role,
    })
}

export async function getPrompts() {
    const user = await getUserWithAuth()

    return db.query.prompts.findMany({
        where: eq(prompts.userId, user.id),
    })
}

export async function createPrompt(name: string, description: string) {
    const user = await getUserWithAuth()

    return db.insert(prompts).values({
        userId: user.id,
        name,
        description,
    })
}

export async function createPromptVersion(promptId: number, content: string) {
    const user = await getUserWithAuth()

    const prompt = await db.query.prompts.findFirst({
        where: eq(prompts.id, promptId),
    })

    if (!prompt) {
        throw new AppError('Prompt not found', 'NOT_FOUND', 404)
    }

    const latestVersion = await db.query.promptVersions.findFirst({
        where: eq(promptVersions.promptId, promptId),
        orderBy: (promptVersions, { desc }) => [desc(promptVersions.version)],
    })

    const newVersionNumber = latestVersion ? latestVersion.version + 1 : 1

    return db.insert(promptVersions).values({
        promptId,
        version: newVersionNumber,
        content,
    })
}

export async function getPrompt(promptId: number) {
    const user = await getUserWithAuth()

    return db.query.prompts.findFirst({
        where: eq(prompts.id, promptId),
        with: {
            versions: true,
        },
    })
}
