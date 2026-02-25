import { useCallback, useEffect, useRef, useState } from 'react'

interface UseTypingGameProps {
    text: string
    onFinish?: () => void
}

export function useTypingGame({ text, onFinish }: UseTypingGameProps) {
    const [userInput, setUserInput] = useState('')
    const [startTime, setStartTime] = useState<number | null>(null)
    const [endTime, setEndTime] = useState<number | null>(null)
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [mistakes, setMistakes] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)

    const calculateStats = useCallback(() => {
        if (startTime) {
            const timeElapsed = (endTime || Date.now()) - startTime
            const timeInMinutes = timeElapsed / 60000
            const wordsTyped = userInput.length / 5
            const newWpm = Math.round(wordsTyped / timeInMinutes) || 0
            const totalCharacters = currentIndex + 1
            const newAccuracy =
                totalCharacters > 0 ? Math.round(((totalCharacters - mistakes) / totalCharacters) * 100) : 100
            setWpm(newWpm)
            setAccuracy(newAccuracy)
        }
    }, [startTime, endTime, userInput, currentIndex, mistakes])

    const calculateStatsRef = useRef(calculateStats)

    useEffect(() => {
        calculateStatsRef.current = calculateStats
        calculateStats()
    }, [calculateStats])

    useEffect(() => {
        if (!startTime || isFinished) return

        const timer = setInterval(() => {
            calculateStatsRef.current()
        }, 1000)

        return () => clearInterval(timer)
    }, [startTime, isFinished])

    const handleInput = useCallback(
        (key: string) => {
            if (isFinished) return

            if (!startTime) {
                setStartTime(Date.now())
            }

            if (key === 'Backspace') {
                setUserInput((prev) => prev.slice(0, -1))
                setCurrentIndex((prev) => prev - 1)
                return { type: 'backspace' as const }
            }

            if (key.length === 1) {
                const newInput = userInput + key
                setUserInput(newInput)
                setCurrentIndex(newInput.length - 1)

                const isCorrect = key === text[newInput.length - 1]
                if (!isCorrect) {
                    setMistakes((prev) => prev + 1)
                }

                if (newInput.length === text.length) {
                    setEndTime(Date.now())
                    setIsFinished(true)
                    onFinish?.()
                }

                return {
                    type: 'character' as const,
                    isCorrect,
                    isFinished: newInput.length === text.length,
                }
            }

            return null
        },
        [text, userInput, startTime, isFinished, onFinish],
    )

    const reset = useCallback(() => {
        setUserInput('')
        setStartTime(null)
        setEndTime(null)
        setCurrentIndex(-1)
        setMistakes(0)
        setIsFinished(false)
        setWpm(0)
        setAccuracy(100)
    }, [])

    return {
        userInput,
        currentIndex,
        isFinished,
        wpm,
        accuracy,
        mistakes,
        startTime,
        endTime,
        handleInput,
        reset,
    }
}
