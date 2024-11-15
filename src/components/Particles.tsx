import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const Particles = () => {
    const [particles, setParticles] = useState<
        Array<{
            id: number
            initialX: number
            initialY: number
            targetX: number
            targetY: number
            size: number
            duration: number
        }>
    >([])

    // Generate particles only on the client side
    useEffect(() => {
        const generateParticles = (count: number) => {
            return Array.from({ length: count }, (_, index) => ({
                id: index,
                initialX: Math.random() * window.innerWidth,
                initialY: Math.random() * window.innerHeight,
                targetX: Math.random() * window.innerWidth,
                targetY: Math.random() * window.innerHeight,
                size: Math.random() * 3 + 1,
                duration: Math.random() * 20 + 10,
            }))
        }

        setParticles(generateParticles(20))
    }, [])

    return (
        <motion.div className="fixed inset-0 z-0">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="particle absolute"
                    initial={{
                        x: particle.initialX,
                        y: particle.initialY,
                    }}
                    animate={{
                        x: particle.targetX,
                        y: particle.targetY,
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                        ease: 'linear',
                    }}
                />
            ))}
        </motion.div>
    )
}
