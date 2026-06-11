'use client'

import { useReducedMotion } from 'framer-motion'
import { BookOpen, LayoutGrid, Palette, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const PLANETS = [
    { key: 'ai-design', icon: Sparkles, color: '#8b5cf6', orbit: 40, size: 28, speed: 30, startAngle: 0 },
    { key: 'design', icon: Palette, color: '#ec4899', orbit: 58, size: 24, speed: 40, startAngle: 60 },
    { key: 'documents', icon: BookOpen, color: '#10b981', orbit: 74, size: 22, speed: 50, startAngle: 120 },
    { key: 'productivity', icon: Zap, color: '#f97316', orbit: 88, size: 20, speed: 60, startAngle: 180 },
    { key: 'finance', icon: TrendingUp, color: '#ef4444', orbit: 100, size: 18, speed: 72, startAngle: 240 },
    { key: 'resources', icon: LayoutGrid, color: '#eab308', orbit: 110, size: 16, speed: 88, startAngle: 300 },
]

const CX = 150
const CY = 150

export function HeroOrbital() {
    const shouldReduceMotion = useReducedMotion()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="relative w-full max-w-[340px] mx-auto aspect-square">
            <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="planet-glow">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Center glow */}
                <circle cx={CX} cy={CY} r="65" fill="url(#center-glow)" />

                {/* Orbit rings */}
                {PLANETS.map((p) => (
                    <circle
                        key={`orbit-${p.key}`}
                        cx={CX}
                        cy={CY}
                        r={p.orbit}
                        fill="none"
                        stroke="hsl(var(--foreground))"
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                        opacity="0.15"
                    />
                ))}

                {/* Center core */}
                <circle cx={CX} cy={CY} r="18" fill="hsl(var(--foreground))" opacity="0.9" />
                <circle cx={CX} cy={CY} r="10" fill="hsl(var(--background))" />
                <circle cx={CX} cy={CY} r="4" fill="hsl(var(--foreground))" />

                {/* Planets — only render on client to avoid hydration mismatch */}
                {mounted &&
                    PLANETS.map((p) => {
                        const Icon = p.icon
                        const animating = !shouldReduceMotion

                        return (
                            <g
                                key={`planet-${p.key}`}
                                style={
                                    animating
                                        ? {
                                              transformOrigin: `${CX}px ${CY}px`,
                                              animation: `orbit-spin-${p.key} ${p.speed}s linear infinite`,
                                          }
                                        : {
                                              transform: `rotate(${p.startAngle}deg)`,
                                              transformOrigin: `${CX}px ${CY}px`,
                                          }
                                }
                            >
                                <circle cx={CX} cy={CY - p.orbit} r={p.size / 2 + 5} fill={p.color} opacity="0.12" />
                                <circle
                                    cx={CX}
                                    cy={CY - p.orbit}
                                    r={p.size / 2}
                                    fill={p.color}
                                    filter="url(#planet-glow)"
                                />
                                <g
                                    style={
                                        animating
                                            ? {
                                                  transformOrigin: `${CX}px ${CY - p.orbit}px`,
                                                  animation: `orbit-counter-spin-${p.key} ${p.speed}s linear infinite`,
                                              }
                                            : {
                                                  transform: `rotate(${-p.startAngle}deg)`,
                                                  transformOrigin: `${CX}px ${CY - p.orbit}px`,
                                              }
                                    }
                                >
                                    <foreignObject
                                        x={CX - p.size / 2}
                                        y={CY - p.orbit - p.size / 2}
                                        width={p.size}
                                        height={p.size}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Icon color="#fff" size={p.size * 0.55} strokeWidth={2.5} />
                                        </div>
                                    </foreignObject>
                                </g>
                            </g>
                        )
                    })}
            </svg>

            {mounted && !shouldReduceMotion && (
                <style>{`
                    ${PLANETS.map(
                        (p) => `
                        @keyframes orbit-spin-${p.key} {
                            from { transform: rotate(${p.startAngle}deg); }
                            to { transform: rotate(${p.startAngle + 360}deg); }
                        }
                        @keyframes orbit-counter-spin-${p.key} {
                            from { transform: rotate(${-p.startAngle}deg); }
                            to { transform: rotate(${-p.startAngle - 360}deg); }
                        }
                    `,
                    ).join('')}
                `}</style>
            )}
        </div>
    )
}
