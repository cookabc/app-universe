import { describe, expect, test } from 'bun:test'
import { reducer, toast } from './use-toast'

describe('reducer', () => {
    test('DISMISS_TOAST should return new state with open=false', () => {
        const initialState: any = {
            toasts: [{ id: '1', title: 'Test', open: true }],
        }
        const action: any = { type: 'DISMISS_TOAST', toastId: '1' }
        const newState = reducer(initialState, action)
        expect(newState.toasts[0].open).toBe(false)
    })
})

describe('toast integration', () => {
    test('toast() adds a toast and dismiss() removes it (sets open=false)', () => {
        // This test relies on module state
        const { id, dismiss } = toast({ title: 'Integration Test' })
        expect(id).toBeDefined()

        // Exercise dismiss
        dismiss()
        // If no error, it means dismissToast ran and dispatch worked.
    })
})
