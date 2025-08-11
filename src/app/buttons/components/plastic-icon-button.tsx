'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface PlasticIconButtonProps {
    icon: React.ReactNode
    label: string
    onClick?: () => void
}

export function PlasticIconButton({ icon, label, onClick }: PlasticIconButtonProps) {
    const [isPressed, setIsPressed] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [wasClicked, setWasClicked] = useState(false)

    const handleClick = () => {
        if (onClick) onClick()
        setWasClicked(true)
        setTimeout(() => setWasClicked(false), 300)
    }

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className={cn(
                'relative w-16 h-16 rounded-full flex items-center justify-center bg-card text-card-foreground transition-all duration-200 ease-in-out',
                {
                    'animate-pulse': wasClicked,
                    'translate-y-0.5 scale-95 shadow-inner': isPressed,
                    'scale-110 shadow-lg': isHovered,
                    'shadow-md': !isPressed && !isHovered,
                },
            )}
            aria-label={label}
        >
            <div className={cn('relative w-7 h-7 flex items-center justify-center', { 'text-primary': wasClicked })}>
                {icon}
            </div>
        </button>
    )
}
