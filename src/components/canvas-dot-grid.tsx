'use client'

import React, { useEffect, useRef } from 'react'

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

        const drawDot = (x: number, y: number, distance: number) => {
            // Base dot
            ctx.beginPath()
            ctx.arc(x, y, config.dotSize / 2, 0, Math.PI * 2)
            ctx.fillStyle = config.baseColor
            ctx.fill()

            // Glowing dot
            const opacity = Math.max(0, 1 - distance / config.maxDistance)
            ctx.beginPath()
            ctx.arc(x, y, (config.dotSize / 2) * 1.5, 0, Math.PI * 2)
            ctx.fillStyle = `${config.glowColor}${opacity})`
            ctx.fill()
        }

        const drawDots = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const rows = Math.floor(canvas.height / config.gap)
            const cols = Math.floor(canvas.width / config.gap)

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * config.gap + config.gap / 2
                    const y = row * config.gap + config.gap / 2

                    const distance = Math.sqrt(
                        Math.pow(mousePosition.current.x - x, 2) + Math.pow(mousePosition.current.y - y, 2),
                    )

                    drawDot(x, y, distance)
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
