import { useEffect, useRef } from 'react'

interface ParticleBase {
    x: number
    y: number
    vx: number
    vy: number
    color: string
}

interface ParticleProps extends ParticleBase {
    radius?: number
    alpha?: number
    life?: number
}

interface UseParticleEffectProps {
    x?: number
    y?: number
    particleCount?: number
    gravity?: number
    colorRange?: {
        hueStart: number
        hueEnd: number
        saturation: number
        lightness: string
    }
}

export function useParticleEffect({
    x = 0,
    y = 0,
    particleCount = 100,
    gravity = 0.05,
    colorRange = {
        hueStart: 180,
        hueEnd: 230,
        saturation: 100,
        lightness: '70%',
    },
}: UseParticleEffectProps = {}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<ParticleProps[]>([])
    const animationRef = useRef<number>(undefined)

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

        const createParticle = (): ParticleProps => {
            const angle = Math.random() * Math.PI * 2
            const speed = Math.random() * 2 + 1
            const hue = colorRange.hueStart + Math.random() * (colorRange.hueEnd - colorRange.hueStart)

            return {
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                radius: Math.random() * 4 + 1,
                color: `hsl(${hue}, ${colorRange.saturation}%, ${colorRange.lightness})`,
                alpha: 1,
                life: Math.random() * 0.5 + 0.5,
            }
        }

        particlesRef.current = Array.from({ length: particleCount }, createParticle)

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particlesRef.current = particlesRef.current.filter((p) => {
                p.x += p.vx
                p.y += p.vy
                p.vy += gravity
                if (p.alpha) p.alpha -= 0.01
                if (p.life) p.life -= 0.02

                const isAlive = p.alpha ? p.alpha > 0 : p.life && p.life > 0
                if (!isAlive) return false

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius || 2, 0, Math.PI * 2)
                ctx.fillStyle = p.color
                ctx.globalAlpha = p.alpha || p.life || 1
                ctx.fill()

                return true
            })

            ctx.globalAlpha = 1

            if (particlesRef.current.length > 0) {
                animationRef.current = requestAnimationFrame(animate)
            }
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            particlesRef.current = []
        }
    }, [x, y, particleCount, gravity, colorRange])

    return canvasRef
}
