import { describe, expect, mock, test } from 'bun:test'

// Mock environment variables
process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db'

// Mock dependencies
// Mock getUserWithAuth to throw error
mock.module('@/hooks/useAuth', () => ({
    getUserWithAuth: async () => {
        throw new Error('User not authenticated')
    },
}))

// Mock AI related modules to avoid import errors
mock.module('ai', () => ({
    streamText: async () => ({
        textStream: (async function* () {
            yield ''
        })(),
    }),
    generateObject: async () => ({ object: [] }),
    generateText: async () => ({ text: '' }),
}))

mock.module('@ai-sdk/openai', () => ({
    openai: () => ({}),
}))

mock.module('@ai-sdk/rsc', () => ({
    createStreamableValue: () => ({ value: {}, update: () => {}, done: () => {}, error: () => {} }),
}))

// Mock Kuroshiro
mock.module('kuroshiro', () => ({
    default: class Kuroshiro {
        async init() {}
        async convert(text: string) { return text }
    },
}))
mock.module('kuroshiro-analyzer-kuromoji', () => ({ default: class KuromojiAnalyzer {} }))

// Mock Next.js cache
mock.module('next/cache', () => ({
    revalidateTag: () => {},
    unstable_cache: (fn: any) => fn,
}))

// Mock Drizzle ORM
mock.module('drizzle-orm', () => ({
    eq: () => ({}),
    and: () => ({}),
    relations: () => {},
}))

mock.module('@/db', () => ({
    db: {
        query: {
            prompts: {
                findFirst: async () => {},
                findMany: async () => [],
            },
            artifacts: { findMany: async () => [] },
            promptVersions: { findFirst: async () => ({ version: 1 }) },
        },
        insert: () => ({ values: async () => {} }),
    },
}))

describe('Security Fix: Auth check in japaneseConvert', () => {
    test('japaneseConvert should FAIL if auth is MISSING (Fixed)', async () => {
        const { japaneseConvert } = await import('./actions')

        const result = await japaneseConvert('hello', 'romaji', 'hiragana')

        // Once fixed, it should return success: false with the error message
        expect(result.success).toBe(false)
        expect(result.error).toBe('User not authenticated')
    })
})
