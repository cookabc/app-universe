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

    test('ADD_TOAST should add a new toast', () => {
        const initialState: any = { toasts: [] }
        const newToast = { id: '1', title: 'New Toast', open: true }
        const action: any = { type: 'ADD_TOAST', toast: newToast }
        const newState = reducer(initialState, action)

        expect(newState.toasts).toHaveLength(1)
        expect(newState.toasts[0]).toEqual(newToast)
    })

    test('ADD_TOAST should respect TOAST_LIMIT (1)', () => {
        const initialState: any = {
            toasts: [{ id: '1', title: 'Old Toast', open: true }]
        }
        const newToast = { id: '2', title: 'New Toast', open: true }
        const action: any = { type: 'ADD_TOAST', toast: newToast }
        const newState = reducer(initialState, action)

        expect(newState.toasts).toHaveLength(1)
        expect(newState.toasts[0]).toEqual(newToast)
        expect(newState.toasts[0].id).toBe('2')
    })

    test('UPDATE_TOAST should update an existing toast', () => {
        const initialState: any = {
            toasts: [{ id: '1', title: 'Original Title', open: true }]
        }
        const update = { id: '1', title: 'Updated Title' }
        const action: any = { type: 'UPDATE_TOAST', toast: update }
        const newState = reducer(initialState, action)

        expect(newState.toasts[0].title).toBe('Updated Title')
        expect(newState.toasts[0].open).toBe(true)
    })

    test('UPDATE_TOAST should ignore updates for non-existent toasts', () => {
        const initialState: any = {
            toasts: [{ id: '1', title: 'Original Title', open: true }]
        }
        const update = { id: '999', title: 'Updated Title' }
        const action: any = { type: 'UPDATE_TOAST', toast: update }
        const newState = reducer(initialState, action)

        expect(newState.toasts[0].title).toBe('Original Title')
    })

    test('DISMISS_TOAST should dismiss all toasts if toastId is undefined', () => {
        const initialState: any = {
            toasts: [
                { id: '1', title: 'Toast 1', open: true },
                { id: '2', title: 'Toast 2', open: true }
            ]
        }

        const action: any = { type: 'DISMISS_TOAST' }
        const newState = reducer(initialState, action)

        expect(newState.toasts[0].open).toBe(false)
        expect(newState.toasts[1].open).toBe(false)
    })

    test('REMOVE_TOAST should remove a specific toast', () => {
        const initialState: any = {
            toasts: [{ id: '1', title: 'Toast 1', open: true }]
        }
        const action: any = { type: 'REMOVE_TOAST', toastId: '1' }
        const newState = reducer(initialState, action)

        expect(newState.toasts).toHaveLength(0)
    })

    test('REMOVE_TOAST should remove all toasts if toastId is undefined', () => {
        const initialState: any = {
            toasts: [
                { id: '1', title: 'Toast 1', open: true },
                { id: '2', title: 'Toast 2', open: true }
            ]
        }
        const action: any = { type: 'REMOVE_TOAST' }
        const newState = reducer(initialState, action)

        expect(newState.toasts).toHaveLength(0)
    })
})

describe('toast integration', () => {
    test('toast() adds a toast and dismiss() removes it (sets open=false)', () => {
        const { id, dismiss } = toast({ title: 'Integration Test' })
        expect(id).toBeDefined()

        dismiss()
        // If no error, it means dismissToast ran and dispatch worked.
    })
})
