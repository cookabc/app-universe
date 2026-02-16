import type React from 'react'
import { useEffect, useState } from 'react'

export const IOSStatusBar: React.FC = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (date: Date) => {
        return date
            .toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            })
            .replace(/ AM| PM/, '')
    }

    return (
        <div className="absolute top-0 left-0 right-0 h-12 px-6 flex justify-between items-center z-50 text-black dark:text-white pointer-events-none select-none">
            <div className="w-20 text-left font-semibold text-[15px] tracking-tight">{formatTime(time)}</div>
            <div className="flex items-center space-x-1.5 opacity-90">
                <span className="material-icons-round text-[18px]">signal_cellular_alt</span>
                <span className="material-icons-round text-[18px]">wifi</span>
                <div className="relative">
                    <span className="material-icons-round text-[18px] rotate-90">battery_full</span>
                </div>
            </div>
        </div>
    )
}

export const IOSHomeIndicator: React.FC = () => {
    return (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center z-50 pointer-events-none pb-1">
            <div className="w-[130px] h-[5px] bg-black/30 dark:bg-white/30 rounded-full backdrop-blur-md"></div>
        </div>
    )
}
