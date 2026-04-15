export interface CanvasConfig {
    dotSize: number
    gap: number
    maxDistance: number
    baseColor: string
    glowColor: string
}

export const drawBaseDots = (ctx: CanvasRenderingContext2D, config: CanvasConfig, rows: number, cols: number) => {
    const dotRadius = config.dotSize / 2
    ctx.beginPath()
    ctx.fillStyle = config.baseColor

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * config.gap + config.gap / 2
            const y = row * config.gap + config.gap / 2
            ctx.moveTo(x + dotRadius, y)
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
        }
    }
    ctx.fill()
}

export const drawGlowDots = (
    ctx: CanvasRenderingContext2D,
    config: CanvasConfig,
    rows: number,
    cols: number,
    mouseX: number,
    mouseY: number,
) => {
    const dotRadius = config.dotSize / 2
    const maxDist = config.maxDistance
    const maxDistSq = maxDist * maxDist

    // Calculate bounding box based on mouse position
    const minCol = Math.max(0, Math.floor((mouseX - maxDist - config.gap / 2) / config.gap))
    const maxCol = Math.min(cols, Math.ceil((mouseX + maxDist - config.gap / 2) / config.gap))

    const minRow = Math.max(0, Math.floor((mouseY - maxDist - config.gap / 2) / config.gap))
    const maxRow = Math.min(rows, Math.ceil((mouseY + maxDist - config.gap / 2) / config.gap))

    for (let row = minRow; row < maxRow; row++) {
        for (let col = minCol; col < maxCol; col++) {
            const x = col * config.gap + config.gap / 2
            const y = row * config.gap + config.gap / 2

            const dx = mouseX - x
            const dy = mouseY - y
            const distSq = dx * dx + dy * dy

            if (distSq < maxDistSq) {
                const distance = Math.sqrt(distSq)
                const opacity = 1 - distance / maxDist

                ctx.beginPath()
                ctx.arc(x, y, dotRadius * 1.5, 0, Math.PI * 2)
                ctx.fillStyle = `${config.glowColor}${opacity})`
                ctx.fill()
            }
        }
    }
}
