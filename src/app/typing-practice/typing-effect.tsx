'use client'

import { useEffect, useRef } from 'react'

interface ParticleProps {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    color: string
}

export function TypingEffect({ x, y }: { x: number; y: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particles = useRef<ParticleProps[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        updateCanvasSize()
        window.addEventListener('resize', updateCanvasSize)

        // Create particles
        const _createParticle = () => {
            const angle = Math.random() * Math.PI * 2
            const speed = Math.random() * 2 + 1
            return {
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                life: Math.random() * 0.5 + 0.5,
                color: `hsl(${180 + Math.random() * 50}, 100%, ${70 + Math.random() * 30}%)`,
            }
        }

        // Animation loop
        let animationFrame: number
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i]
                p.x += p.vx
                p.y += p.vy
                p.vy += 0.1 // gravity
                p.life -= 0.02

                if (p.life <= 0) {
                    particles.current.splice(i, 1)
                    continue
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
                ctx.fillStyle = p.color
                ctx.globalAlpha = p.life
                ctx.fill()
            }

            animationFrame = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationFrame)
            window.removeEventListener('resize', updateCanvasSize)
        }
    }, [x, y])

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />
}
