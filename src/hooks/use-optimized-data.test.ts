import { GlobalRegistrator } from '@happy-dom/global-registrator'
GlobalRegistrator.register()

import { describe, expect, test } from 'bun:test'
import { renderHook, waitFor } from '@testing-library/react'
import { useOptimizedData } from './use-optimized-data'

describe('useOptimizedData', () => {
    test('should fetch data on mount', async () => {
        const mockData = { id: 1, name: 'Test' }
        const fetcher = async () => mockData

        const { result } = renderHook(() => useOptimizedData(fetcher))

        expect(result.current.isLoading).toBe(true)

        await waitFor(() => expect(result.current.data).toEqual(mockData))
        expect(result.current.isLoading).toBe(false)
    })
})
