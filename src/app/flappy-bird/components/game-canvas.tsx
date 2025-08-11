import { useRef, useEffect } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants'
import { drawBird } from '../game/bird'
import { drawPipes } from '../game/pipe'
import type { Bird, Pipe } from '../game/types'

interface GameCanvasProps {
    bird: Bird
    pipes: Pipe[]
}

export function GameCanvas({ bird, pipes }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.fillStyle = 'skyblue'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        // Clouds
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

        drawBird(ctx, bird)
        drawPipes(ctx, pipes)
    }, [bird, pipes])

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-border focus:outline-none"
        />
    )
}
