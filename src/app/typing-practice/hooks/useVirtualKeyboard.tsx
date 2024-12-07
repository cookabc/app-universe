import { cn } from '@/lib/utils'
import { useCallback, useEffect, useState } from 'react'
import { MOBILE_BREAKPOINT, VIRTUAL_KEYBOARD_KEYS } from '../constants'

interface VirtualKeyboardProps {
    onKeyPress: (key: string) => void
}

export function useVirtualKeyboard({ onKeyPress }: VirtualKeyboardProps) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleVirtualKeyPress = useCallback(
        (key: string) => {
            onKeyPress(key)
        },
        [onKeyPress],
    )

    const renderVirtualKeyboard = useCallback(() => {
        if (!isMobile) return null

        return (
            <div className={`grid grid-cols-10 gap-1 mt-4`}>
                {VIRTUAL_KEYBOARD_KEYS.map((key, index) => (
                    <button
                        key={key}
                        onClick={() => handleVirtualKeyPress(key)}
                        className={cn(
                            `p-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded`,
                            key === 'Backspace' ? 'col-span-2' : '',
                        )}
                    >
                        {key === 'Backspace' ? '⌫' : key}
                    </button>
                ))}
                <button
                    onClick={() => handleVirtualKeyPress(' ')}
                    className={cn(`col-span-10 mt-1 p-2`, `bg-white/10 hover:bg-white/20 text-white rounded`)}
                >
                    Space
                </button>
            </div>
        )
    }, [isMobile, handleVirtualKeyPress])

    return {
        isMobile,
        renderVirtualKeyboard,
    }
}
