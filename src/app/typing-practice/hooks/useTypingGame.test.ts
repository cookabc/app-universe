import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, jest } from 'bun:test'
import { useTypingGame } from './useTypingGame'

GlobalRegistrator.register()

describe('useTypingGame', () => {
    const text = 'hello world'
    const onFinish = jest.fn()

    beforeEach(() => {
        onFinish.mockClear()
        jest.restoreAllMocks()
    })

    test('should initialize with default values', () => {
        const { result } = renderHook(() => useTypingGame({ text, onFinish }))

        expect(result.current.userInput).toBe('')
        expect(result.current.currentIndex).toBe(-1)
        expect(result.current.mistakes).toBe(0)
        expect(result.current.isFinished).toBe(false)
        expect(result.current.wpm).toBe(0)
        expect(result.current.accuracy).toBe(100)
        expect(result.current.startTime).toBeNull()
        expect(result.current.endTime).toBeNull()
    })

    test('should start timer on first input', () => {
        const { result } = renderHook(() => useTypingGame({ text, onFinish }))

        const now = 1000
        const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(now)

        act(() => {
            result.current.handleInput('h')
        })

        expect(result.current.startTime).toBe(now)
        expect(result.current.userInput).toBe('h')
        expect(result.current.currentIndex).toBe(0)

        dateSpy.mockRestore()
    })

    test('should handle correct input', () => {
        const { result } = renderHook(() => useTypingGame({ text, onFinish }))

        act(() => {
            result.current.handleInput('h')
        })

        expect(result.current.userInput).toBe('h')
        expect(result.current.currentIndex).toBe(0)
        expect(result.current.mistakes).toBe(0)
    })

    test('should handle incorrect input', () => {
        const { result } = renderHook(() => useTypingGame({ text, onFinish }))

        act(() => {
            result.current.handleInput('x')
        })

        expect(result.current.userInput).toBe('x')
        expect(result.current.currentIndex).toBe(0)
        expect(result.current.mistakes).toBe(1)
    })

    test('should handle backspace', () => {
        const { result } = renderHook(() => useTypingGame({ text, onFinish }))

        act(() => {
            result.current.handleInput('h')
        })

        expect(result.current.userInput).toBe('h')

        act(() => {
            result.current.handleInput('Backspace')
        })

        expect(result.current.userInput).toBe('')
        expect(result.current.currentIndex).toBe(-1)
    })

    test('should complete game when text matches', () => {
        const { result } = renderHook(() => useTypingGame({ text, onFinish }))

        // Type all characters except last one
        for (let i = 0; i < text.length - 1; i++) {
            act(() => {
                result.current.handleInput(text[i])
            })
        }

        expect(result.current.isFinished).toBe(false)
        expect(onFinish).not.toHaveBeenCalled()

        // Type last character
        act(() => {
            result.current.handleInput(text[text.length - 1])
        })

        expect(result.current.isFinished).toBe(true)
        expect(result.current.endTime).not.toBeNull()
        expect(onFinish).toHaveBeenCalled()
    })

    test('should calculate stats correctly', () => {
         const { result } = renderHook(() => useTypingGame({ text: 'hello world', onFinish }))

         const startTime = 1000
         const duration = 60000 // 1 minute
         const endTime = startTime + duration

         let currentTime = startTime
         const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => currentTime)

         // Start typing
         act(() => {
             result.current.handleInput('h')
         })

         expect(result.current.startTime).toBe(startTime)

         // Type rest except last char
         const remaining = 'ello world'
         const lastChar = remaining[remaining.length - 1]
         const middle = remaining.slice(0, -1)

         for (const char of middle) {
             act(() => {
                 result.current.handleInput(char)
             })
         }

         // Update time for the finish
         currentTime = endTime

         act(() => {
             result.current.handleInput(lastChar)
         })

         expect(result.current.isFinished).toBe(true)
         expect(result.current.endTime).toBe(endTime)

         // Words: "hello world" -> 2 words
         // Time: 1 min
         // WPM: 2 / 1 = 2
         expect(result.current.wpm).toBe(2)
         expect(result.current.accuracy).toBe(100)

         dateSpy.mockRestore()
    })

    test('should reset game', () => {
        const { result } = renderHook(() => useTypingGame({ text, onFinish }))

        act(() => {
            result.current.handleInput('h')
        })

        expect(result.current.userInput).toBe('h')
        expect(result.current.startTime).not.toBeNull()

        act(() => {
            result.current.reset()
        })

        expect(result.current.userInput).toBe('')
        expect(result.current.startTime).toBeNull()
        expect(result.current.currentIndex).toBe(-1)
        expect(result.current.mistakes).toBe(0)
    })
})
