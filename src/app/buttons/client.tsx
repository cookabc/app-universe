'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { ButtonGrid } from './components/button-grid'
import { ButtonStats } from './components/button-stats'

export default function ButtonsClient() {
    const [_isPending, startTransition] = useTransition()
    const [clickedButtons, setClickedButtons] = useState<string[]>([])

    const buttonStats = useMemo(
        () => ({
            totalButtons: 20, // Based on ICON_LIST length
            clickedCount: clickedButtons.length,
            completionRate: Math.round((clickedButtons.length / 20) * 100),
        }),
        [clickedButtons.length],
    )

    const handleButtonClick = useCallback((label: string) => {
        startTransition(() => {
            setClickedButtons((prev) => (prev.includes(label) ? prev : [...prev, label]))
        })
    }, [])

    return (
        <AppErrorBoundary>
            <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-gradient-to-r from-yellow-50 to-amber-100 shadow-inner-lg">
                <ButtonStats {...buttonStats} />
                <ButtonGrid handleButtonClick={handleButtonClick} />
                {buttonStats.clickedCount > 0 && (
                    <div className="mt-8 text-center">
                        <div className="w-64 bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${buttonStats.completionRate}%` }}
                            />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {buttonStats.clickedCount === buttonStats.totalButtons
                                ? '🎉 All buttons clicked!'
                                : `${buttonStats.totalButtons - buttonStats.clickedCount} buttons remaining`}
                        </p>
                    </div>
                )}
            </div>
        </AppErrorBoundary>
    )
}
