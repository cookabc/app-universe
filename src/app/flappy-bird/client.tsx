'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { GameCanvas } from './components/game-canvas'
import { GameOverScreen } from './components/game-over-screen'
import { Scoreboard } from './components/scoreboard'
import { createBird, jumpBird, updateBird } from './game/bird'
import { checkCollision, createPipe, updatePipes } from './game/pipe'
import type { Bird, Pipe } from './game/types'

export default function FlappyBirdClient() {
    const [bird, setBird] = useState<Bird>(createBird())
    const [pipes, setPipes] = useState<Pipe[]>([])
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [isGameOver, setIsGameOver] = useState(false)
    const [isGameStarted, setIsGameStarted] = useState(false)

    const [_isPending, startTransition] = useTransition()

    const gameStats = useMemo(
        () => ({
            currentScore: score,
            highScore: Math.max(score, highScore),
            gameProgress: Math.min(score / 50, 1),
            difficulty: Math.floor(score / 10) + 1,
        }),
        [score, highScore],
    )

    useEffect(() => {
        const storedHighScore = localStorage.getItem('flappyBirdHighScore')
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10))
        }
    }, [])

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('flappyBirdHighScore', score.toString())
        }
    }, [score, highScore])

    const handleJump = useCallback(() => {
        if (!isGameStarted) {
            setIsGameStarted(true)
        }
        if (!isGameOver) {
            setBird(jumpBird)
        }
    }, [isGameStarted, isGameOver])

    const handleReset = useCallback(() => {
        setBird(createBird())
        setPipes([createPipe()])
        setScore(0)
        setIsGameStarted(false)
        setIsGameOver(false)
    }, [])

    useEffect(() => {
        if (!isGameStarted || isGameOver) return

        const gameLoop = () => {
            startTransition(() => {
                setBird(updateBird)
                setPipes((prevPipes) => updatePipes(prevPipes, setScore))

                if (checkCollision(bird, pipes)) {
                    setIsGameOver(true)
                }
            })
            requestAnimationFrame(gameLoop)
        }

        const animationFrameId = requestAnimationFrame(gameLoop)
        return () => cancelAnimationFrame(animationFrameId)
    }, [isGameStarted, isGameOver, bird, pipes])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                handleJump()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [handleJump])

    return (
        <AppErrorBoundary>
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <GameCanvas bird={bird} pipes={pipes} />
                <Scoreboard score={score} highScore={highScore} />
                {isGameOver && <GameOverScreen handleReset={handleReset} />}
            </div>
        </AppErrorBoundary>
    )
}
