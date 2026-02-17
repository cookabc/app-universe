'use client'

import { RotateCcw } from 'lucide-react'
import { useCallback, useMemo, useRef, useState, useTransition } from 'react'
import { GameErrorBoundary } from '@/components/optimized/error-boundary'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CelebrationEffect } from './celebration-effect'
import { SAMPLE_TEXT } from './constants'
import { useTypingGame } from './hooks/useTypingGame'
import { useVirtualKeyboard } from './hooks/useVirtualKeyboard'
import { TypingEffect } from './typing-effect'

export default function TypingPracticeClient() {
    const [text] = useState(SAMPLE_TEXT)
    const [effectPosition, setEffectPosition] = useState({ x: 0, y: 0 })
    const [showEffect, setShowEffect] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [showCelebration, setShowCelebration] = useState(false)
    const [celebrationKey, setCelebrationKey] = useState(0)
    const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 })

    const [_isPending, startTransition] = useTransition()

    const handleFinish = useCallback(() => {
        setShowCelebration(true)
        setTimeout(() => {
            setShowCelebration(false)
        }, 3000)
    }, [])

    const {
        userInput,
        currentIndex,
        isFinished,
        wpm,
        accuracy,
        mistakes,
        startTime,
        endTime,
        handleInput,
        reset: resetGame,
    } = useTypingGame({
        text,
        onFinish: handleFinish,
    })
    const gameStats = useMemo(
        () => ({
            wpm,
            accuracy,
            correctWords: Math.max(0, Math.floor((currentIndex + 1 - mistakes) / 5)),
            timeElapsed: startTime ? (((endTime || Date.now()) - startTime) / 1000).toFixed(1) : '0.0',
            progress: Math.min((currentIndex / text.length) * 100, 100),
        }),
        [wpm, accuracy, currentIndex, mistakes, startTime, endTime, text.length],
    )
    const textDisplayRef = useRef<HTMLDivElement>(null)
    const charsRef = useRef<(HTMLSpanElement | null)[]>([])

    const updateCursorPosition = useCallback(() => {
        if (!textDisplayRef.current) return

        const nextIndex = currentIndex + 1
        if (nextIndex >= 0 && nextIndex < text.length) {
            const currentChar = charsRef.current[nextIndex]
            if (currentChar) {
                const rect = currentChar.getBoundingClientRect()
                const containerRect = textDisplayRef.current.getBoundingClientRect()
                setCursorPosition({
                    left: rect.left - containerRect.left,
                    top: rect.top - containerRect.top,
                })

                if (nextIndex < userInput.length) {
                    setEffectPosition({ x: rect.right, y: rect.bottom })
                    setShowEffect(true)
                    setTimeout(() => setShowEffect(false), 100)
                }
            }
        } else if (nextIndex === 0) {
            setCursorPosition({ left: 0, top: 0 })
        }
    }, [currentIndex, text.length, userInput.length])

    const handleReset = useCallback(() => {
        resetGame()
        setCelebrationKey((prev) => prev + 1)
        setCursorPosition({ left: 0, top: 0 })
        if (textDisplayRef.current) {
            textDisplayRef.current.focus()
        }
    }, [resetGame])

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Escape') {
                handleReset()
                return
            }
            const result = handleInput(e.key)
            if (result && result.type === 'character' && !result.isCorrect) {
                setIsInvalid(true)
                setTimeout(() => setIsInvalid(false), 200)

                // Trigger shake animation using Web Animations API
                if (textDisplayRef.current) {
                    textDisplayRef.current.animate(
                        [
                            { transform: 'translateX(0)' },
                            { transform: 'translateX(-5px)' },
                            { transform: 'translateX(5px)' },
                            { transform: 'translateX(-5px)' },
                            { transform: 'translateX(5px)' },
                            { transform: 'translateX(0)' },
                        ],
                        {
                            duration: 400,
                            easing: 'cubic-bezier(.36,.07,.19,.97)',
                        },
                    )
                }
            }
            startTransition(() => {
                updateCursorPosition()
            })
        },
        [handleInput, updateCursorPosition, handleReset],
    )

    const { isMobile, renderVirtualKeyboard } = useVirtualKeyboard({
        onKeyPress: useCallback(
            (key: string) => {
                handleInput(key)
                updateCursorPosition()
            },
            [handleInput, updateCursorPosition],
        ),
    })

    return (
        <GameErrorBoundary>
            <div className="p-4 sm:p-8">
                {showEffect && <TypingEffect x={effectPosition.x} y={effectPosition.y} />}
                {showCelebration && <CelebrationEffect key={celebrationKey} />}
                <Card className="max-w-4xl mx-auto p-4 sm:p-8">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">ProTypist</h1>
                    <div className="space-y-4 sm:space-y-8">
                        <div
                            ref={textDisplayRef}
                            className="font-mono text-lg sm:text-2xl leading-relaxed text-muted-foreground min-h-[100px] relative outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                            style={{
                                maxWidth: '100vw',
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                            }}
                            onKeyDown={handleKeyPress}
                            role="textbox"
                            aria-label="Typing area"
                            aria-invalid={isInvalid}
                            tabIndex={0}
                        >
                            {text.split('').map((char, index) => (
                                <span
                                    key={index}
                                    ref={(el) => {
                                        if (el) charsRef.current[index] = el
                                    }}
                                    className={`${
                                        index < userInput.length
                                            ? userInput[index] === char
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                            {!isFinished && (
                                <span
                                    className="absolute inline-block h-0.5 bg-primary"
                                    style={{
                                        left: `${cursorPosition.left}px`,
                                        top: `${cursorPosition.top + 24}px`,
                                        width: '0.61em',
                                        animation: 'blink 1s infinite',
                                    }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                            <Card className="p-2 sm:p-4">
                                <div className="text-xs sm:text-sm text-muted-foreground">WPM</div>
                                <div className="text-2xl sm:text-4xl font-bold">{gameStats.wpm}</div>
                            </Card>
                            <Card className="p-2 sm:p-4">
                                <div className="text-xs sm:text-sm text-muted-foreground">Accuracy</div>
                                <div className="text-2xl sm:text-4xl font-bold">{gameStats.accuracy}%</div>
                            </Card>
                            <Card className="p-2 sm:p-4">
                                <div className="text-xs sm:text-sm text-muted-foreground">Correct Words</div>
                                <div className="text-2xl sm:text-4xl font-bold">{gameStats.correctWords}</div>
                            </Card>
                            <Card className="p-2 sm:p-4">
                                <div className="text-xs sm:text-sm text-muted-foreground">Time</div>
                                <div className="text-2xl sm:text-4xl font-bold">{gameStats.timeElapsed}s</div>
                            </Card>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="gap-2"
                                aria-keyshortcuts="Escape"
                                title="Press Esc to reset"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                                <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-1">
                                    Esc
                                </kbd>
                            </Button>
                        </div>

                        {isMobile && renderVirtualKeyboard()}
                    </div>
                </Card>
                <style jsx>{`
                    @keyframes blink {
                        0%,
                        100% {
                            opacity: 0;
                        }
                        50% {
                            opacity: 1;
                        }
                    }
                `}</style>
            </div>
        </GameErrorBoundary>
    )
}
