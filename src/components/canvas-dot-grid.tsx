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

        let rows = 0
        let cols = 0

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            rows = Math.floor(canvas.height / config.gap)
            cols = Math.floor(canvas.width / config.gap)
        }

        const drawDots = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Batch Base Dots
            ctx.fillStyle = config.baseColor
            ctx.beginPath()

            const dotRadius = config.dotSize / 2

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * config.gap + config.gap / 2
                    const y = row * config.gap + config.gap / 2

                    ctx.moveTo(x + dotRadius, y)
                    ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
                }
            }

            ctx.fill()

            // Draw Glowing Dots - Optimized Loop
            const maxDist = config.maxDistance
            const maxDistSq = maxDist * maxDist

            // Calculate bounding box based on mouse position
            // x = col * gap + gap/2  =>  col = (x - gap/2) / gap
            const minCol = Math.max(0, Math.floor((mousePosition.current.x - maxDist - config.gap / 2) / config.gap))
            const maxCol = Math.min(cols, Math.ceil((mousePosition.current.x + maxDist - config.gap / 2) / config.gap))

            const minRow = Math.max(0, Math.floor((mousePosition.current.y - maxDist - config.gap / 2) / config.gap))
            const maxRow = Math.min(rows, Math.ceil((mousePosition.current.y + maxDist - config.gap / 2) / config.gap))

            for (let row = minRow; row < maxRow; row++) {
                for (let col = minCol; col < maxCol; col++) {
                    const x = col * config.gap + config.gap / 2
                    const y = row * config.gap + config.gap / 2

                    const dx = mousePosition.current.x - x
                    const dy = mousePosition.current.y - y
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
