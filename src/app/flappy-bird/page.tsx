'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'

interface Bird {
    x: number
    y: number
    velocity: number
    show: (ctx: CanvasRenderingContext2D) => void
}

interface Pipe {
    x: number
    top: number
    bottom: number
    w: number
    speed: number
    spacing: number
    hits: (bird: Bird) => boolean
    update: () => void
    offscreen: () => boolean
    show: (ctx: CanvasRenderingContext2D) => void
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const BIRD_WIDTH = 40
const BIRD_HEIGHT = 40
const GRAVITY = 0.1
const LIFT = -4
const PIPE_SPACING = 350
const PIPE_WIDTH = 80
const PIPE_SPEED = 1.5
const MIN_PIPE_GAP = 250

class BirdClass implements Bird {
    x: number
    y: number
    velocity: number

    constructor() {
        this.x = 50
        this.y = CANVAS_HEIGHT / 2 - BIRD_HEIGHT / 2
        this.velocity = 0
    }

    show(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'yellow'
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, BIRD_WIDTH / 2, BIRD_HEIGHT / 2, 0, 0, 2 * Math.PI)
        ctx.fill()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw eye
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.ellipse(this.x + 10, this.y - 5, 5, 5, 0, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.ellipse(this.x + 12, this.y - 5, 2, 2, 0, 0, 2 * Math.PI)
        ctx.fill()

        // Draw beak
        ctx.fillStyle = 'orange'
        ctx.beginPath()
        ctx.moveTo(this.x + 20, this.y)
        ctx.lineTo(this.x + 30, this.y + 5)
        ctx.lineTo(this.x + 20, this.y + 10)
        ctx.closePath()
        ctx.fill()
    }
}

class PipeClass implements Pipe {
    x: number
    top: number
    bottom: number
    w: number
    speed: number
    spacing: number

    constructor() {
        this.spacing = MIN_PIPE_GAP
        this.top = Math.random() * (CANVAS_HEIGHT - MIN_PIPE_GAP - 200) + 100
        this.bottom = CANVAS_HEIGHT - (this.top + this.spacing)
        this.x = CANVAS_WIDTH
        this.w = PIPE_WIDTH
        this.speed = PIPE_SPEED
    }

    hits(bird: Bird) {
        if (bird.y - BIRD_HEIGHT / 2 < this.top || bird.y + BIRD_HEIGHT / 2 > CANVAS_HEIGHT - this.bottom) {
            if (bird.x + BIRD_WIDTH / 2 > this.x && bird.x - BIRD_WIDTH / 2 < this.x + this.w) {
                return true
            }
        }
        return false
    }

    update() {
        this.x -= this.speed
    }

    offscreen() {
        return this.x < -this.w
    }

    show(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x, 0, this.w, this.top)
        ctx.fillRect(this.x, CANVAS_HEIGHT - this.bottom, this.w, this.bottom)

        // Add pipe caps
        ctx.fillStyle = 'darkgreen'
        ctx.fillRect(this.x - 5, this.top - 20, this.w + 10, 20)
        ctx.fillRect(this.x - 5, CANVAS_HEIGHT - this.bottom, this.w + 10, 20)
    }
}

const useGameLoop = (isGameStarted: boolean, isGameOver: boolean, setIsGameOver: (value: boolean) => void) => {
    const [bird, setBird] = useState<Bird>(new BirdClass())
    const [pipes, setPipes] = useState<Pipe[]>([])
    const [score, setScore] = useState(0)

    useEffect(() => {
        if (!isGameStarted || isGameOver) return

        let animationFrameId: number
        const gameLoop = () => {
            setBird((prevBird) => {
                const newBird = new BirdClass()
                newBird.x = prevBird.x
                newBird.y = prevBird.y + prevBird.velocity + GRAVITY
                newBird.velocity = prevBird.velocity + GRAVITY

                // Apply boundaries
                if (newBird.y > CANVAS_HEIGHT - BIRD_HEIGHT) {
                    newBird.y = CANVAS_HEIGHT - BIRD_HEIGHT
                    newBird.velocity = 0
                }
                if (newBird.y < 0) {
                    newBird.y = 0
                    newBird.velocity = 0
                }
                return newBird
            })

            setPipes((prevPipes) => {
                const updatedPipes = updatePipes(prevPipes, bird, setScore)
                // Check for collisions
                if (updatedPipes.some((pipe) => pipe.hits(bird))) {
                    setIsGameOver(true)
                }
                return updatedPipes
            })

            animationFrameId = requestAnimationFrame(gameLoop)
        }

        animationFrameId = requestAnimationFrame(gameLoop)
        return () => cancelAnimationFrame(animationFrameId)
    }, [isGameStarted, isGameOver, bird, setIsGameOver])

    return { bird, setBird, pipes, setPipes, score, setScore }
}

const updatePipes = (prevPipes: Pipe[], _bird: Bird, setScore: (cb: (prev: number) => number) => void) => {
    const updatedPipes = prevPipes
        .map((pipe) => {
            const newPipe = new PipeClass()
            Object.assign(newPipe, {
                x: pipe.x - pipe.speed,
                top: pipe.top,
                bottom: pipe.bottom,
                w: pipe.w,
                speed: pipe.speed,
                spacing: pipe.spacing,
            })
            return newPipe
        })
        .filter((pipe) => {
            if (pipe.offscreen()) {
                setScore((prev) => prev + 1)
                return false
            }
            return true
        })

    if (prevPipes.length === 0 || prevPipes[prevPipes.length - 1].x < CANVAS_WIDTH - PIPE_SPACING) {
        return [...updatedPipes, new PipeClass()]
    }
    return updatedPipes
}

export default function ImprovedFlappyBird() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [highScore, setHighScore] = useState(0)
    const [isGameOver, setIsGameOver] = useState(false)
    const [isGameStarted, setIsGameStarted] = useState(false)

    // React 19: useTransition for non-blocking game state updates
    const [_isPending, startTransition] = useTransition()

    const { bird, setBird, pipes, setPipes, score, setScore } = useGameLoop(isGameStarted, isGameOver, setIsGameOver)

    // React 19: useMemo for expensive game calculations
    const _gameStats = useMemo(
        () => ({
            currentScore: score,
            highScore: Math.max(score, highScore),
            gameProgress: Math.min(score / 50, 1), // Progress towards difficulty increase
            difficulty: Math.floor(score / 10) + 1,
        }),
        [score, highScore],
    )

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('flappyBirdHighScore', score.toString())
        }
    }, [score, highScore])

    const handleJump = useCallback(() => {
        // React 19: Use startTransition for non-blocking state updates
        startTransition(() => {
            if (!isGameStarted) {
                setIsGameStarted(true)
            }
            if (!isGameOver) {
                setBird((prevBird) => {
                    const newBird = new BirdClass()
                    newBird.x = prevBird.x
                    newBird.y = prevBird.y
                    newBird.velocity = LIFT
                    return newBird
                })
            }
        })
    }, [isGameStarted, isGameOver, setBird])

    const handleReset = useCallback(() => {
        setBird(new BirdClass())
        setPipes([new PipeClass()])
        setScore(0)
        setIsGameStarted(false)
        setIsGameOver(false)
    }, [setBird, setPipes, setScore])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const render = () => {
            ctx.fillStyle = 'skyblue'
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

            // Draw clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.beginPath()
            ctx.arc(100, 100, 30, 0, 2 * Math.PI)
            ctx.arc(130, 100, 40, 0, 2 * Math.PI)
            ctx.arc(160, 100, 30, 0, 2 * Math.PI)
            ctx.fill()

            ctx.beginPath()
            ctx.arc(300, 150, 40, 0, 2 * Math.PI)
            ctx.arc(340, 150, 50, 0, 2 * Math.PI)
            ctx.arc(380, 150, 40, 0, 2 * Math.PI)
            ctx.fill()

            if (isGameStarted && !isGameOver) {
                bird.show(ctx)

                for (const pipe of pipes) {
                    pipe.show(ctx)
                }

                ctx.fillStyle = 'white'
                ctx.font = '32px Arial'
                ctx.textAlign = 'right'
                ctx.fillText(score.toString(), CANVAS_WIDTH - 20, 40)
            } else {
                bird.show(ctx)

                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

                ctx.fillStyle = 'white'
                ctx.font = '48px Arial'
                ctx.textAlign = 'center'
                ctx.fillText(isGameOver ? 'Game Over' : 'Flappy Bird', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50)

                ctx.font = '24px Arial'
                ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50)

                ctx.font = '18px Arial'
                ctx.fillText('Press Space to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100)
            }

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [bird, pipes, score, highScore, isGameOver, isGameStarted])

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-300 focus:outline-hidden"
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 text-center"
            >
                <p className="text-2xl font-bold mb-2">Score: {score}</p>
                <p className="text-xl mb-4">High Score: {highScore}</p>
                {isGameOver && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors duration-200"
                    >
                        Restart
                    </motion.button>
                )}
            </motion.div>
        </div>
    )
}
