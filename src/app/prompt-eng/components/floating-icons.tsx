'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Cpu, Database, Cloud, Bot } from 'lucide-react'

interface FloatingIconProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    x: number
    y: number
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon: Icon, x, y }) => (
    <motion.div
        className="absolute text-primary opacity-50"
        style={{ x, y }}
        animate={{ y: [y, y - 50, y], opacity: [0.5, 1, 0.5] }}
        transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 5 + Math.random() * 5,
            ease: 'easeInOut',
        }}
    >
        <Icon width={24 + Math.random() * 24} height={24 + Math.random() * 24} />
    </motion.div>
)

export function FloatingIcons() {
    const icons = [Cpu, Database, Cloud, Bot]
    const [iconPositions, setIconPositions] = useState<{ x: number; y: number }[]>([])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const positions = Array.from({ length: 20 }).map(() => ({
                x: Math.random() * (window.innerWidth - 24),
                y: Math.random() * (window.innerHeight - 24),
            }))
            setIconPositions(positions)
        }
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none">
            {iconPositions.map((pos, i) => {
                const icon = icons[Math.floor(Math.random() * icons.length)]!
                return <FloatingIcon key={i} icon={icon} x={pos.x} y={pos.y} />
            })}
        </div>
    )
}
