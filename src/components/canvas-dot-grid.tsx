'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { type CanvasConfig, drawBaseDots, drawGlowDots } from './canvas-dot-grid.utils'

interface CanvasDotGridProps {
    className?: string
}

export const CanvasDotGrid: React.FC<CanvasDotGridProps> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mousePosition = useRef({ x: 0, y: 0 })
    const isVisibleRef = useRef(true)
    const lastMoveTime = useRef(0)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    useEffect(() => {
        // Skip animation if user prefers reduced motion
        if (prefersReducedMotion) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const config: CanvasConfig = {
            dotSize: 2,
            gap: 24,
            maxDistance: 150,
            baseColor: 'rgba(255, 255, 255, 0.2)',
            glowColor: 'rgba(59, 130, 246, ',
        }

        let rows = 0
        let cols = 0
        let animationFrameId: number
        let frameCount = 0

        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            ctx.scale(dpr, dpr)
            rows = Math.floor(window.innerHeight / config.gap)
            cols = Math.floor(window.innerWidth / config.gap)
        }

        const drawDots = () => {
            if (!isVisibleRef.current) {
                animationFrameId = requestAnimationFrame(drawDots)
                return
            }

            // Limit to 30fps for better performance
            frameCount++
            if (frameCount % 2 !== 0) {
                animationFrameId = requestAnimationFrame(drawDots)
                return
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            drawBaseDots(ctx, config, rows, cols)

            drawGlowDots(ctx, config, rows, cols, mousePosition.current.x, mousePosition.current.y)

            animationFrameId = requestAnimationFrame(drawDots)
        }

        const handleMouseMove = (event: MouseEvent) => {
            const now = Date.now()
            if (now - lastMoveTime.current < 16) return
            lastMoveTime.current = now

            const rect = canvas.getBoundingClientRect()
            mousePosition.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            }
        }

        const handleVisibilityChange = () => {
            isVisibleRef.current = document.visibilityState === 'visible'
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting
            },
            { threshold: 0 },
        )

        observer.observe(canvas)

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('resize', resizeCanvas, { passive: true })
        document.addEventListener('visibilitychange', handleVisibilityChange)

        resizeCanvas()
        drawDots()

        return () => {
            observer.disconnect()
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', resizeCanvas)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            cancelAnimationFrame(animationFrameId)
        }
    }, [prefersReducedMotion])

    // Render static version for reduced motion preference
    if (prefersReducedMotion) {
        return (
            <div
                className={`z-0 fixed left-0 top-0 right-0 bottom-0 pointer-events-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${className || ''}`}
                aria-hidden="true"
            />
        )
    }

    return (
        <canvas
            ref={canvasRef}
            className={`z-0 fixed left-0 top-0 right-0 bottom-0 pointer-events-none will-change-transform ${className || ''}`}
            style={{ touchAction: 'none' }}
            role="img"
            aria-label="Interactive dot grid background animation"
        />
    )
}
