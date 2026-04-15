'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'

interface ParticleProps {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    color: string
}

export interface TypingEffectHandle {
    trigger: (x: number, y: number) => void
}

export const TypingEffect = forwardRef<TypingEffectHandle>((_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<ParticleProps[]>([])
    const animationFrameRef = useRef<number | null>(null)

    // Using a named function expression/declaration allows self-reference
    function animate() {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update and draw particles
        if (particlesRef.current.length === 0) {
            animationFrameRef.current = null
            // Ensure cleared
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            return
        }

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
            const p = particlesRef.current[i]
            if (!p) continue
            p.x += p.vx
            p.y += p.vy
            p.vy += 0.1 // gravity
            p.life -= 0.02

            if (p.life <= 0) {
                particlesRef.current.splice(i, 1)
                continue
            }

            ctx.beginPath()
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.globalAlpha = p.life
            ctx.fill()
        }

        if (particlesRef.current.length > 0) {
            animationFrameRef.current = requestAnimationFrame(animate)
        } else {
            animationFrameRef.current = null
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
    }

    const createParticles = useCallback((x: number, y: number) => {
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = Math.random() * 2 + 1
            particlesRef.current.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                life: Math.random() * 0.5 + 0.5,
                color: `hsl(${180 + Math.random() * 50}, 100%, ${70 + Math.random() * 30}%)`,
            })
        }
        if (!animationFrameRef.current) {
            animate()
        }
    }, [])

    useImperativeHandle(ref, () => ({
        trigger: createParticles,
    }))

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        updateCanvasSize()
        window.addEventListener('resize', updateCanvasSize)

        return () => {
            window.removeEventListener('resize', updateCanvasSize)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />
})

TypingEffect.displayName = 'TypingEffect'
