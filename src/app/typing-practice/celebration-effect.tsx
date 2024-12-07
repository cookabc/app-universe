'use client'

import { useEffect, useRef } from 'react'

interface ParticleProps {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    color: string
    alpha: number
}

export function CelebrationEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<ParticleProps[]>([])
    const animationRef = useRef<number>()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        const createParticle = (): ParticleProps => ({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * -3 - 2,
            radius: Math.random() * 4 + 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            alpha: 1,
        })

        for (let i = 0; i < 100; i++) {
            particlesRef.current.push(createParticle())
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particlesRef.current.forEach((p, index) => {
                p.x += p.vx
                p.y += p.vy
                p.vy += 0.05
                p.alpha -= 0.01

                if (p.alpha <= 0) {
                    particlesRef.current[index] = createParticle()
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
                ctx.fillStyle = p.color
                ctx.globalAlpha = p.alpha
                ctx.fill()
            })

            ctx.globalAlpha = 1

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            particlesRef.current = []
        }
    }, [])

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />
}
