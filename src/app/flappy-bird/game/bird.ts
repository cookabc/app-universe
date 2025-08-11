import { BIRD_HEIGHT, BIRD_WIDTH, CANVAS_HEIGHT, GRAVITY, LIFT } from './constants'
import type { Bird } from './types'

export function createBird(): Bird {
    return {
        x: 50,
        y: CANVAS_HEIGHT / 2 - BIRD_HEIGHT / 2,
        velocity: 0,
    }
}

export function updateBird(bird: Bird): Bird {
    const newVelocity = bird.velocity + GRAVITY
    const newY = bird.y + newVelocity

    if (newY > CANVAS_HEIGHT - BIRD_HEIGHT) {
        return { ...bird, y: CANVAS_HEIGHT - BIRD_HEIGHT, velocity: 0 }
    }
    if (newY < 0) {
        return { ...bird, y: 0, velocity: 0 }
    }

    return { ...bird, y: newY, velocity: newVelocity }
}

export function jumpBird(bird: Bird): Bird {
    return { ...bird, velocity: LIFT }
}

export function drawBird(ctx: CanvasRenderingContext2D, bird: Bird) {
    ctx.fillStyle = 'yellow'
    ctx.beginPath()
    ctx.ellipse(bird.x, bird.y, BIRD_WIDTH / 2, BIRD_HEIGHT / 2, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.stroke()

    // Eye
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.ellipse(bird.x + 10, bird.y - 5, 5, 5, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.ellipse(bird.x + 12, bird.y - 5, 2, 2, 0, 0, 2 * Math.PI)
    ctx.fill()

    // Beak
    ctx.fillStyle = 'orange'
    ctx.beginPath()
    ctx.moveTo(bird.x + 20, bird.y)
    ctx.lineTo(bird.x + 30, bird.y + 5)
    ctx.lineTo(bird.x + 20, bird.y + 10)
    ctx.closePath()
    ctx.fill()
}
