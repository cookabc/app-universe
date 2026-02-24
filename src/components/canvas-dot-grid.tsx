'use client'

import type React from 'react'
import { useEffect, useRef } from 'react'

interface CanvasDotGridProps {
    className?: string
}

export const CanvasDotGrid: React.FC<CanvasDotGridProps> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mousePosition = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const config = {
            dotSize: 2,
            gap: 24,
            maxDistance: 150,
            baseColor: 'rgba(255, 255, 255, 0.2)',
            glowColor: 'rgba(59, 130, 246, ',
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const drawDots = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Calculate grid dimensions
            const rows = Math.floor(canvas.height / config.gap)
            const cols = Math.floor(canvas.width / config.gap)

            // 1. Batch Base Dots
            // Drawing all base dots in a single path is much faster than individual fill() calls.
            ctx.beginPath()
            ctx.fillStyle = config.baseColor

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * config.gap + config.gap / 2
                    const y = row * config.gap + config.gap / 2
                    // moveTo is crucial to create separate circles without connecting lines
                    ctx.moveTo(x + config.dotSize / 2, y)
                    ctx.arc(x, y, config.dotSize / 2, 0, Math.PI * 2)
                }
            }
            ctx.fill()

            // 2. Optimize Glow Dots
            // Instead of checking distance for every dot (expensive), we calculate the
            // range of grid cells that are potentially within maxDistance of the mouse.
            const mouseX = mousePosition.current.x
            const mouseY = mousePosition.current.y
            const maxDistSq = config.maxDistance * config.maxDistance

            // Determine the grid range to check
            // x = col * gap + gap/2
            // We want indices where (x - mouseX)^2 <= maxDistSq (roughly)
            // col * gap + gap/2 >= mouseX - maxDistance
            // col >= (mouseX - maxDistance - gap/2) / gap
            // Using a slightly wider range to be safe

            const startCol = Math.max(0, Math.floor((mouseX - config.maxDistance) / config.gap))
            const endCol = Math.min(cols, Math.ceil((mouseX + config.maxDistance) / config.gap))

            const startRow = Math.max(0, Math.floor((mouseY - config.maxDistance) / config.gap))
            const endRow = Math.min(rows, Math.ceil((mouseY + config.maxDistance) / config.gap))

            for (let row = startRow; row < endRow; row++) {
                for (let col = startCol; col < endCol; col++) {
                    const x = col * config.gap + config.gap / 2
                    const y = row * config.gap + config.gap / 2

                    const dx = mouseX - x
                    const dy = mouseY - y
                    const distSq = dx * dx + dy * dy

                    if (distSq < maxDistSq) {
                        const distance = Math.sqrt(distSq)
                        // Verify this formula matches the original: max(0, 1 - dist/maxDist)
                        // Since dist < maxDist, dist/maxDist < 1, so 1 - ... > 0.
                        const opacity = 1 - distance / config.maxDistance

                        ctx.beginPath()
                        ctx.arc(x, y, (config.dotSize / 2) * 1.5, 0, Math.PI * 2)
                        ctx.fillStyle = `${config.glowColor}${opacity})`
                        ctx.fill()
                    }
                }
            }

            return requestAnimationFrame(drawDots)
        }

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mousePosition.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('resize', resizeCanvas)

        resizeCanvas()
        const animationFrameId = drawDots()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className={`z-0 fixed left-0 top-0 right-0 bottom-0 pointer-events-none ${className || ''}`}
            style={{ touchAction: 'none' }}
        />
    )
}
