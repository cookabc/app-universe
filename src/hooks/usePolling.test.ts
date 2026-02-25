import { describe, expect, mock, test } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { act, renderHook, waitFor } from '@testing-library/react'
import { usePolling, useSimplePolling } from './usePolling'

GlobalRegistrator.register()

// Use longer intervals to avoid flakiness with real timers
const INTERVAL = 500

describe('useSimplePolling', () => {
    test('should fetch data immediately and on interval', async () => {
        const mockFn = mock(() => Promise.resolve('test-data'))

        const { result, unmount } = renderHook(() => useSimplePolling({ fn: mockFn, interval: INTERVAL }))

        // Initial fetch
        await waitFor(() => expect(result.current).toBe('test-data'))
        expect(mockFn).toHaveBeenCalledTimes(1)

        // Wait for interval
        await new Promise((r) => setTimeout(r, INTERVAL + 100))

        // Should have at least one more call
        await waitFor(() => expect(mockFn).toHaveBeenCalledTimes(2))

        unmount()
    })

    test('should not fetch if enabled is false', async () => {
        const mockFn = mock(() => Promise.resolve('test-data'))

        const { result, unmount } = renderHook(() =>
            useSimplePolling({ fn: mockFn, interval: INTERVAL, enabled: false }),
        )

        await new Promise((r) => setTimeout(r, INTERVAL / 2))
        expect(mockFn).not.toHaveBeenCalled()
        expect(result.current).toBeNull()

        unmount()
    })
})

describe('usePolling', () => {
    test('should fetch data immediately on mount by default', async () => {
        const mockFn = mock(() => Promise.resolve('data'))
        const { result, unmount } = renderHook(() => usePolling({ fn: mockFn, interval: INTERVAL }))

        expect(result.current.loading).toBe(true)
        await waitFor(() => expect(result.current.data).toBe('data'))
        expect(result.current.loading).toBe(false)
        expect(mockFn).toHaveBeenCalledTimes(1)

        unmount()
    })

    test('should not fetch immediately if immediate is false', async () => {
        const mockFn = mock(() => Promise.resolve('data'))
        const { result, unmount } = renderHook(() => usePolling({ fn: mockFn, interval: INTERVAL, immediate: false }))

        // immediate: false means isActive=false initially.
        // It should NOT fetch.
        expect(result.current.loading).toBe(false)
        expect(mockFn).not.toHaveBeenCalled()

        // Wait for interval. Since isActive is false, it should STILL not fetch.
        await new Promise((r) => setTimeout(r, INTERVAL + 100))
        expect(mockFn).not.toHaveBeenCalled()

        unmount()
    })

    test('start() should trigger fetch and start interval', async () => {
        const mockFn = mock(() => Promise.resolve('data'))
        const { result, unmount } = renderHook(() =>
            usePolling({
                fn: mockFn,
                interval: INTERVAL,
                enabled: false,
                immediate: true,
            }),
        )

        expect(mockFn).not.toHaveBeenCalled()

        act(() => {
            result.current.start()
        })

        // Check for double fetch issue here
        await waitFor(() => expect(result.current.loading).toBe(true))

        // Wait a bit to ensure async operations complete, but less than INTERVAL
        await new Promise((r) => setTimeout(r, 100))

        // Should be exactly 1 call (initial fetch triggered by effect)
        expect(mockFn).toHaveBeenCalledTimes(1)

        unmount()
    })

    test('stop() should stop polling', async () => {
        const mockFn = mock(() => Promise.resolve('data'))
        const { result, unmount } = renderHook(() => usePolling({ fn: mockFn, interval: INTERVAL }))

        await waitFor(() => expect(mockFn).toHaveBeenCalledTimes(1))

        act(() => {
            result.current.stop()
        })

        await new Promise((r) => setTimeout(r, INTERVAL + 100))
        // Should not have called again
        expect(mockFn).toHaveBeenCalledTimes(1)

        unmount()
    })

    test('refetch() should fetch data manually', async () => {
        const mockFn = mock(() => Promise.resolve('data'))
        const { result, unmount } = renderHook(() => usePolling({ fn: mockFn, interval: INTERVAL, enabled: false }))

        await act(async () => {
            await result.current.refetch()
        })

        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(result.current.data).toBe('data')

        unmount()
    })

    test('should handle errors', async () => {
        const error = new Error('Test error')
        const mockFn = mock(() => Promise.reject(error))
        const onError = mock(() => {})

        const { result, unmount } = renderHook(() =>
            usePolling({
                fn: mockFn,
                interval: INTERVAL,
                onError,
            }),
        )

        await waitFor(() => expect(result.current.error).toEqual(error))
        expect(onError).toHaveBeenCalledWith(error)

        unmount()
    })

    test('should call onSuccess callback', async () => {
        const mockFn = mock(() => Promise.resolve('data'))
        const onSuccess = mock(() => {})

        const { unmount } = renderHook(() =>
            usePolling({
                fn: mockFn,
                interval: INTERVAL,
                onSuccess,
            }),
        )

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('data'))

        unmount()
    })
})
