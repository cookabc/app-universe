import { beforeEach, describe, expect, it, mock } from 'bun:test'

// Mock React cache
// This mock simulates React.cache behavior for async functions
const mockCacheImpl = (fn: any) => {
    let cachedResult: any
    let hasCache = false
    return async (...args: any[]) => {
        if (hasCache) {
            return cachedResult
        }
        cachedResult = await fn(...args)
        hasCache = true
        return cachedResult
    }
}

const mockCache = mock(mockCacheImpl)

mock.module('react', () => {
    return {
        cache: mockCache,
    }
})

// Mock @clerk/nextjs/server
mock.module('@clerk/nextjs/server', () => ({
    auth: mock(() => Promise.resolve({ userId: 'user_123' })),
}))

// Mock db
const mockFindFirst = mock(() => Promise.resolve({ id: 1, clerkId: 'user_123', email: 'test@example.com' }))

mock.module('@/db', () => ({
    db: {
        query: {
            users: {
                findFirst: mockFindFirst,
            },
        },
    },
}))

// Import the function under test
// Using dynamic import to ensure mocks are applied
const { getUserWithAuth } = await import('./useAuth')

describe('getUserWithAuth Performance', () => {
    beforeEach(() => {
        mockFindFirst.mockClear()
    })

    it('should query the database only once with cache', async () => {
        await getUserWithAuth()
        await getUserWithAuth()

        // Expect 1 call now because of our mock cache
        expect(mockFindFirst).toHaveBeenCalledTimes(1)
    })
})
