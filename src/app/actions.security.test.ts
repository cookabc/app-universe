import { afterEach, describe, expect, mock, test } from 'bun:test'

// Mock environment variables
process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db'

// Mock dependencies
mock.module('@/hooks/useAuth', () => ({
    getUserWithAuth: async () => ({ id: 123 }),
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
        init() {}
        convert() {}
    },
}))
mock.module('kuroshiro-analyzer-kuromoji', () => ({ default: class KuromojiAnalyzer {} }))

// Mock Next.js cache
mock.module('next/cache', () => ({
    revalidateTag: () => {},
    unstable_cache: (fn: any) => fn,
}))

// Mock Drizzle ORM to return inspectable objects
// We need to mock 'eq' and 'and' to verify the query structure
mock.module('drizzle-orm', () => ({
    eq: (col: any, val: any) => ({ type: 'eq', col, val }),
    and: (...args: any[]) => ({ type: 'and', args }),
    relations: () => {},
}))

// Mock DB with spies
const findFirstSpy = mock(() => Promise.resolve({ id: 456, userId: 123 }))
const findManySpy = mock(() => Promise.resolve([]))
const insertSpy = mock(() => ({ values: () => Promise.resolve() }))

mock.module('@/db', () => ({
    db: {
        query: {
            prompts: {
                findFirst: findFirstSpy,
                findMany: findManySpy,
            },
            artifacts: { findMany: async () => [] },
            promptVersions: { findFirst: async () => ({ version: 1 }) },
        },
        insert: insertSpy,
    },
}))

describe('Security Fix: IDOR in getPrompt', () => {
    afterEach(() => {
        findFirstSpy.mockClear()
    })

    test('getPrompt now verifies userId (SECURE)', async () => {
        const { getPrompt } = await import('./actions')

        await getPrompt(456)

        expect(findFirstSpy).toHaveBeenCalled()
        const callArgs = findFirstSpy.mock.calls[0]
        const whereClause = callArgs[0].where

        // Now it should be an 'and' check
        expect(whereClause.type).toBe('and')
        expect(whereClause.args).toBeDefined()
        // It might be an array or arguments depending on how 'and' spreads them
        // My mock: and: (...args) => ({ type: 'and', args }),
        // Usage: and(eq(...), eq(...)) -> args is [eq(...), eq(...)]
        expect(whereClause.args).toHaveLength(2)

        // args[0] should be eq(prompts.id, promptId)
        expect(whereClause.args[0].type).toBe('eq')
        expect(whereClause.args[0].val).toBe(456)

        // args[1] should be eq(prompts.userId, user.id)
        expect(whereClause.args[1].type).toBe('eq')
        expect(whereClause.args[1].val).toBe(123)
    })
})

describe('Security Fix: IDOR in createPromptVersion', () => {
    afterEach(() => {
        findFirstSpy.mockClear()
    })

    test('createPromptVersion now verifies userId (SECURE)', async () => {
        const { createPromptVersion } = await import('./actions')

        // Mock finding a prompt so it proceeds (if secure query matches)
        // Since we are mocking the response, the query itself doesn't matter for the return value,
        // but we are asserting the query structure.
        findFirstSpy.mockResolvedValueOnce({ id: 456, userId: 123 })

        // Our mocked user is 123
        await createPromptVersion(456, 'new content')

        expect(findFirstSpy).toHaveBeenCalled()
        const callArgs = findFirstSpy.mock.calls[0]
        const whereClause = callArgs[0].where

        // Should be 'and' check
        expect(whereClause.type).toBe('and')
        expect(whereClause.args).toHaveLength(2)

        expect(whereClause.args[0].type).toBe('eq')
        expect(whereClause.args[0].val).toBe(456)

        expect(whereClause.args[1].type).toBe('eq')
        expect(whereClause.args[1].val).toBe(123)
    })
})
