import { GlobalRegistrator } from '@happy-dom/global-registrator'
GlobalRegistrator.register()

import { describe, expect, test } from 'bun:test'
import { renderHook, act } from '@testing-library/react'
import { useOptimisticMutation } from './use-optimistic-mutation'

describe('useOptimisticMutation', () => {
    test('should update optimistically', async () => {
        const mutationFn = async (val: string) => `result-${val}`
        const optimisticUpdate = (val: string) => `optimistic-${val}`

        let successVal = ''
        const { result } = renderHook(() => useOptimisticMutation(mutationFn, {
            optimisticUpdate,
            onSuccess: (data) => { successVal = data }
        }))

        act(() => {
            result.current.mutate('test')
        })

        expect(successVal).toBe('optimistic-test')

        // Wait for actual result
        await act(async () => {
            await new Promise(r => setTimeout(r, 0))
        })

        expect(successVal).toBe('result-test')
    })
})
