import { CANVAS_HEIGHT, CANVAS_WIDTH, MIN_PIPE_GAP, PIPE_SPACING, PIPE_SPEED, PIPE_WIDTH } from './constants'
import type { Pipe, Bird } from './types'

export function createPipe(): Pipe {
    const spacing = MIN_PIPE_GAP
    const top = Math.random() * (CANVAS_HEIGHT - MIN_PIPE_GAP - 200) + 100
    const bottom = CANVAS_HEIGHT - (top + spacing)

    return {
        x: CANVAS_WIDTH,
        top,
        bottom,
        w: PIPE_WIDTH,
        speed: PIPE_SPEED,
        spacing,
    }
}

export function updatePipes(pipes: Pipe[], setScore: (cb: (prev: number) => number)): Pipe[] {
    const updatedPipes = pipes
        .map((pipe) => ({ ...pipe, x: pipe.x - pipe.speed }))
        .filter((pipe) => {
            if (pipe.x < -pipe.w) {
                setScore((prev) => prev + 1)
                return false
            }
            return true
        })

    const lastPipe = pipes[pipes.length - 1]
    if (pipes.length === 0 || (lastPipe && lastPipe.x < CANVAS_WIDTH - PIPE_SPACING)) {
        return [...updatedPipes, createPipe()]
    }

    return updatedPipes
}

export function checkCollision(bird: Bird, pipes: Pipe[]): boolean {
    for (const pipe of pipes) {
        if (
            bird.y - 20 < pipe.top ||
            (bird.y + 20 > CANVAS_HEIGHT - pipe.bottom && bird.x + 20 > pipe.x && bird.x - 20 < pipe.x + pipe.w)
        ) {
            return true
        }
    }
    return false
}

export function drawPipes(ctx: CanvasRenderingContext2D, pipes: Pipe[]) {
    ctx.fillStyle = 'green'
    for (const pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipe.w, pipe.top)
        ctx.fillRect(pipe.x, CANVAS_HEIGHT - pipe.bottom, pipe.w, pipe.bottom)

        // Pipe caps
        ctx.fillStyle = 'darkgreen'
        ctx.fillRect(pipe.x - 5, pipe.top - 20, pipe.w + 10, 20)
        ctx.fillRect(pipe.x - 5, CANVAS_HEIGHT - pipe.bottom, pipe.w + 10, 20)
    }
}
