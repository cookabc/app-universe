'use server'

import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import { unstable_cache } from 'next/cache'
import { z } from 'zod'
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

async function _getQuestions(prompt: string) {
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

export const japaneseConvert = async (
    text: string,
    fromType: string,
    toType: string,
): Promise<{ success: boolean; data?: string; error?: string }> => {
    const result = await safeAsync(async () => {
        await getUserWithAuth()

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
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(fromLang)}|${encodeURIComponent(toLang)}`,
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
