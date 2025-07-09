'use client'

import { RotateCcw } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CelebrationEffect } from './celebration-effect'
import { SAMPLE_TEXT } from './constants'
import { useTypingGame } from './hooks/useTypingGame'
import { useVirtualKeyboard } from './hooks/useVirtualKeyboard'
import { TypingEffect } from './typing-effect'

export default function TypingPractice() {
    const [text] = useState(SAMPLE_TEXT)
    const [effectPosition, setEffectPosition] = useState({ x: 0, y: 0 })
    const [showEffect, setShowEffect] = useState(false)
    const [showCelebration, setShowCelebration] = useState(false)
    const [celebrationKey, setCelebrationKey] = useState(0)
    const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 })
    const textDisplayRef = useRef<HTMLDivElement>(null)
    const charsRef = useRef<(HTMLSpanElement | null)[]>([])

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

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            handleInput(e.key)
            updateCursorPosition()
        },
        [handleInput, updateCursorPosition],
    )

    const handleReset = useCallback(() => {
        resetGame()
        setCelebrationKey((prev) => prev + 1)
        setCursorPosition({ left: 0, top: 0 })
        if (textDisplayRef.current) {
            textDisplayRef.current.focus()
        }
    }, [resetGame])

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
        <div className="min-h-screen bg-linear-to-br from-purple-900 via-slate-900 to-blue-900 p-4 sm:p-8">
            {showEffect && <TypingEffect x={effectPosition.x} y={effectPosition.y} />}
            {showCelebration && <CelebrationEffect key={celebrationKey} />}
            <Card className="max-w-4xl mx-auto p-4 sm:p-8 bg-black/40 backdrop-blur-xl border-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">ProTypist</h1>
                <div className="space-y-4 sm:space-y-8">
                    <div
                        ref={textDisplayRef}
                        className="font-mono text-lg sm:text-2xl leading-relaxed text-gray-400 min-h-[100px] relative outline-hidden"
                        style={{
                            maxWidth: '100%',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                        }}
                        tabIndex={0}
                        onKeyDown={handleKeyPress}
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
                                        : 'text-gray-500'
                                }`}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                        {!isFinished && (
                            <span
                                className="absolute inline-block h-0.5 bg-orange-500"
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
                        <Card className="p-2 sm:p-4 bg-black/40">
                            <div className="text-xs sm:text-sm text-gray-400">WPM</div>
                            <div className="text-2xl sm:text-4xl font-bold text-white">{wpm}</div>
                        </Card>
                        <Card className="p-2 sm:p-4 bg-black/40">
                            <div className="text-xs sm:text-sm text-gray-400">Accuracy</div>
                            <div className="text-2xl sm:text-4xl font-bold text-white">{accuracy}%</div>
                        </Card>
                        <Card className="p-2 sm:p-4 bg-black/40">
                            <div className="text-xs sm:text-sm text-gray-400">Correct Words</div>
                            <div className="text-2xl sm:text-4xl font-bold text-white">
                                {Math.max(0, Math.floor((currentIndex + 1 - mistakes) / 5))}
                            </div>
                        </Card>
                        <Card className="p-2 sm:p-4 bg-black/40">
                            <div className="text-xs sm:text-sm text-gray-400">Time</div>
                            <div className="text-2xl sm:text-4xl font-bold text-white">
                                {startTime ? (((endTime || Date.now()) - startTime) / 1000).toFixed(1) : '0.0'}s
                            </div>
                        </Card>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="gap-2 bg-white/10 hover:bg-white/20 text-white"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </Button>
                    </div>

                    {isMobile && renderVirtualKeyboard()}
                </div>
            </Card>
            <style jsx>{`
                @keyframes blink {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    )
}
