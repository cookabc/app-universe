import { expect, test, describe, beforeEach, afterEach } from 'bun:test'
import { renderHook, act } from '@testing-library/react'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { useTypingGame } from './useTypingGame'

if (typeof window === 'undefined') { GlobalRegistrator.register() }

describe('useTypingGame WPM Calculation', () => {
    const originalNow = Date.now

    beforeEach(() => {
        global.Date.now = originalNow
    })

    afterEach(() => {
        global.Date.now = originalNow
    })

    test('calculates WPM based on standard formula (chars/5)', async () => {
        let currentTime = 1000000
        global.Date.now = () => currentTime

        const { result } = renderHook(() => useTypingGame({ text: 'a b c d e' }))

        // Start typing
        act(() => {
            result.current.handleInput('a')
        })

        // Advance time by 30 seconds
        currentTime += 30000

        // Type the rest: " b c d e"
        const remaining = " b c d e"
        for (const char of remaining) {
            act(() => {
                result.current.handleInput(char)
            })
            currentTime += 100
        }

        // Total time approx 30.8s
        // Standard WPM: 9 chars / 5 = 1.8 words. 1.8 / (30.8/60) = 1.8 / 0.513 = 3.5 -> 4

        console.log('Final WPM:', result.current.wpm)
        expect(result.current.wpm).toBe(4)
    })
})
