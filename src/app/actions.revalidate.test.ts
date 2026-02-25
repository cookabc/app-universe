import { describe, expect, mock, test, beforeEach } from 'bun:test'

// Mock environment variables
process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db'

// Mock dependencies
const revalidateTagMock = mock(() => {})

mock.module('next/cache', () => ({
    revalidateTag: revalidateTagMock,
    unstable_cache: (fn: any) => fn,
}))

// Mock other dependencies to avoid runtime errors
mock.module('@/hooks/useAuth', () => ({
    getUserWithAuth: async () => ({ id: 123 }),
}))

mock.module('drizzle-orm', () => ({
    eq: () => {},
    and: () => {},
}))

// Mock schema to avoid drizzle-orm/pg-core import issues
mock.module('@/db/schema', () => ({
    artifacts: {},
    prompts: {},
    promptVersions: {},
}))

mock.module('@/db', () => ({
    db: {
        query: {
            artifacts: { findMany: async () => [] },
            prompts: { findMany: async () => [], findFirst: async () => null },
            promptVersions: { findFirst: async () => null }
        },
        insert: () => ({ values: () => Promise.resolve() })
    }
}))

mock.module('ai', () => ({
    streamText: async () => ({ textStream: (async function* () {})() }),
    generateObject: async () => ({ object: [] }),
    generateText: async () => ({ text: '' }),
}))

mock.module('@ai-sdk/openai', () => ({
    openai: () => ({}),
}))

mock.module('@ai-sdk/rsc', () => ({
    createStreamableValue: () => ({ value: {}, update: () => {}, done: () => {}, error: () => {} }),
}))

mock.module('kuroshiro', () => ({
    default: class Kuroshiro {
        init() {}
        convert() {}
    },
}))
mock.module('kuroshiro-analyzer-kuromoji', () => ({ default: class KuromojiAnalyzer {} }))

// Mock zod
mock.module('zod', () => ({
    z: {
        object: () => ({}),
        string: () => ({}),
        number: () => ({}),
        enum: () => ({}),
        array: () => ({ length: () => ({}) }),
    },
}))


describe('revalidateTag usage', () => {
    beforeEach(() => {
        revalidateTagMock.mockClear()
    })

    test('revalidateTranslations should call revalidateTag with only one argument', async () => {
        const { revalidateTranslations } = await import('./actions')
        await revalidateTranslations()

        expect(revalidateTagMock).toHaveBeenCalledTimes(1)
        expect(revalidateTagMock.mock.calls[0].length).toBe(1)
        expect(revalidateTagMock.mock.calls[0][0]).toBe('translations')
    })

    test('revalidateQuestions should call revalidateTag with only one argument', async () => {
        const { revalidateQuestions } = await import('./actions')
        await revalidateQuestions()

        expect(revalidateTagMock).toHaveBeenCalledTimes(1)
        expect(revalidateTagMock.mock.calls[0].length).toBe(1)
        expect(revalidateTagMock.mock.calls[0][0]).toBe('mbti-questions')
    })

    test('clearTranslationCache should call revalidateTag with only one argument', async () => {
        const { clearTranslationCache } = await import('./actions')
        await clearTranslationCache('en', 'es')

        expect(revalidateTagMock).toHaveBeenCalledTimes(1)
        expect(revalidateTagMock.mock.calls[0].length).toBe(1)
        expect(revalidateTagMock.mock.calls[0][0]).toBe('translation-en-es')
    })
})
