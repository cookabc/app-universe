import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, mock, beforeEach, afterEach, jest } from 'bun:test'
import { useOptimizedData } from './use-optimized-data'

GlobalRegistrator.register()

describe('useOptimizedData', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should retry on error with exponential backoff and stop after max retries', async () => {
        const fetcher = mock(async () => {
            throw new Error('Fetch error')
        })

        const { result, unmount } = renderHook(() => useOptimizedData(fetcher, {
            errorRetryCount: 3,
            errorRetryInterval: 20, // Short interval for testing
            dedupingInterval: 0,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }))

        // Initial fetch
        expect(result.current.isLoading).toBe(true)
        // Wait for initial call
        await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1))

        // Wait for retries to complete (max retries = 3)
        // Delays: 20, 40, 80ms. Total ~140ms.
        // We wait a bit more to ensure stability.

        await waitFor(() => {
             // We expect 1 initial + 3 retries = 4 calls
             expect(fetcher).toHaveBeenCalledTimes(4)
        }, { timeout: 1000 })

        // Ensure no more calls happen
        await new Promise(r => setTimeout(r, 200))
        expect(fetcher).toHaveBeenCalledTimes(4)

        unmount()
    })
})
