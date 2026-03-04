'use client'

import { RotateCcw, Lock, Keyboard } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { GameErrorBoundary } from '@/components/optimized/error-boundary'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CelebrationEffect } from './celebration-effect'
import { SAMPLE_TEXT } from './constants'
import { useTypingGame } from './hooks/useTypingGame'
import { useVirtualKeyboard } from './hooks/useVirtualKeyboard'
import { TypingEffect, type TypingEffectHandle } from './typing-effect'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function TypingPracticeClient() {
    const { t } = useTranslation()
    const [text] = useState(SAMPLE_TEXT)
    const [isInvalid, setIsInvalid] = useState(false)
    const effectRef = useRef<TypingEffectHandle>(null)
    const [showCelebration, setShowCelebration] = useState(false)
    const [celebrationKey, setCelebrationKey] = useState(0)
    const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 })
    const [isCapsLockOn, setIsCapsLockOn] = useState(false)

    const [_isPending, startTransition] = useTransition()

    useEffect(() => {
        const handleModifierState = (e: Event) => {
            if (e instanceof KeyboardEvent || e instanceof MouseEvent) {
                setIsCapsLockOn(e.getModifierState('CapsLock'))
            }
        }

        window.addEventListener('keydown', handleModifierState)
        window.addEventListener('keyup', handleModifierState)
        window.addEventListener('mousedown', handleModifierState)

        return () => {
            window.removeEventListener('keydown', handleModifierState)
            window.removeEventListener('keyup', handleModifierState)
            window.removeEventListener('mousedown', handleModifierState)
        }
    }, [])

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
    const chars = useMemo(() => text.split(''), [text])

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
                    effectRef.current?.trigger(rect.right, rect.bottom)
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
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-background text-foreground transition-colors duration-300">
                <TypingEffect ref={effectRef} />
                {showCelebration && <CelebrationEffect key={celebrationKey} />}

                {/* Minimalist Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-8 w-full max-w-4xl px-8 flex justify-between items-center"
                >
                    <div className="flex items-center gap-2 text-primary font-bold text-xl">
                        <Keyboard className="w-6 h-6" />
                        {t('typingPractice.appName')}
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-muted-foreground">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-foreground">{gameStats.wpm}</span>
                            <span className="text-xs uppercase tracking-wider">{t('typingPractice.stats.wpm')}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-foreground">{gameStats.accuracy}%</span>
                            <span className="text-xs uppercase tracking-wider">{t('typingPractice.stats.accuracy')}</span>
                        </div>
                        <div className="hidden sm:flex flex-col items-center">
                            <span className="text-2xl font-bold text-foreground">{gameStats.timeElapsed}</span>
                            <span className="text-xs uppercase tracking-wider">{t('typingPractice.stats.time')}</span>
                        </div>
                    </div>
                </motion.div>

                <div className="w-full max-w-4xl px-4 sm:px-8 flex flex-col gap-8">
                    {/* Main Typing Area */}
                    <div className="relative group">
                        <div
                            ref={textDisplayRef}
                            className="font-mono text-2xl sm:text-3xl lg:text-4xl leading-relaxed text-muted-foreground/30 min-h-[200px] outline-none tracking-wide text-center"
                            style={{
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                            }}
                            onKeyDown={handleKeyPress}
                            role="textbox"
                            aria-label={t('typingPractice.typingArea')}
                            aria-invalid={isInvalid}
                            tabIndex={0}
                        >
                            {isCapsLockOn && (
                                <div
                                    role="alert"
                                    className="absolute -top-12 right-0 flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20"
                                >
                                    <Lock className="w-3 h-3" />
                                    {t('typingPractice.capsLock')}
                                </div>
                            )}
                            {chars.map((char, index) => (
                                <span
                                    key={index}
                                    ref={(el) => {
                                        if (el) charsRef.current[index] = el
                                    }}
                                    className={`transition-colors duration-100 ${index < userInput.length
                                            ? userInput[index] === char
                                                ? 'text-foreground'
                                                : 'text-red-500'
                                            : 'text-muted-foreground/20'
                                        } ${index === currentIndex + 1 ? 'border-b-2 border-primary' : ''}`}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </div>

                        {/* Subtle Reset Button */}
                        <motion.div
                            className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={false}
                        >
                            <Button
                                onClick={handleReset}
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-widest">{t('typingPractice.restart')}</span>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Virtual Keyboard */}
                    {isMobile && (
                        <div className="fixed bottom-0 left-0 w-full p-2 bg-background/80 backdrop-blur-lg border-t border-border/10">
                            {renderVirtualKeyboard()}
                        </div>
                    )}
                </div>
            </div>
        </GameErrorBoundary>
    )
}
