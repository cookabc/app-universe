'use client'

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { PaceInput } from './components/pace-input'
import { PaceStats } from './components/pace-stats'
import { PaceTable } from './components/pace-table'
import { DISTANCES } from './constants'

export default function PaceCalculatorClient() {
    const [minutes, setMinutes] = useState('5')
    const [seconds, setSeconds] = useState('00')
    const [paceTable, setPaceTable] = useState<string[][]>([])
    const [isDetailedView, setIsDetailedView] = useState(false)
    const [basePace, setBasePace] = useState(300) // 5:00 min/km in seconds
    const [inputMode, setInputMode] = useState<'select' | 'input'>('select')

    const calculateTime = (distance: number, paceSeconds: number) => {
        if (!paceSeconds || isNaN(distance)) return '--:--'
        const totalSeconds = distance * paceSeconds
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const secondsValue = Math.round(totalSeconds % 60)
        return hours > 0
            ? `${hours}:${minutes.toString().padStart(2, '0')}:${secondsValue.toString().padStart(2, '0')}`
            : `${minutes}:${secondsValue.toString().padStart(2, '0')}`
    }

    const [isPending, startTransition] = useTransition()

    const calculatePaceTable = useCallback(() => {
        const paces = [-10, -5, 0, 5, 10].map((diff) => basePace + diff)
        const filteredDistances = isDetailedView
            ? DISTANCES
            : DISTANCES.filter((d) => d.value % 5 === 0 || d.value === 21.1 || d.value === 42.2)
        const table = filteredDistances.map((distance) => paces.map((pace) => calculateTime(distance.value, pace)))
        setPaceTable(table)
    }, [basePace, isDetailedView])

    useEffect(() => {
        calculatePaceTable()
    }, [calculatePaceTable])

    const paceStats = useMemo(() => {
        const currentPaceSeconds = parseInt(minutes) * 60 + parseInt(seconds)
        const marathonTime = calculateTime(42.2, currentPaceSeconds)
        const halfMarathonTime = calculateTime(21.1, currentPaceSeconds)
        const tenKTime = calculateTime(10, currentPaceSeconds)
        const fiveKTime = calculateTime(5, currentPaceSeconds)

        return {
            currentPace: `${minutes}:${seconds}`,
            marathonTime,
            halfMarathonTime,
            tenKTime,
            fiveKTime,
            paceLevel:
                currentPaceSeconds < 240
                    ? '精英'
                    : currentPaceSeconds < 300
                      ? '优秀'
                      : currentPaceSeconds < 360
                        ? '良好'
                        : '入门',
        }
    }, [minutes, seconds])

    const calculatePace = useCallback(() => {
        startTransition(() => {
            const baseSeconds = parseInt(minutes) * 60 + parseInt(seconds)
            setBasePace(baseSeconds)
        })
    }, [minutes, seconds])

    const formatPace = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <AppErrorBoundary>
            <div className="container mx-auto p-4 space-y-8">
                <Card className="border-0 shadow-none">
                    <CardHeader className="px-0">
                        <CardTitle className="text-3xl font-bold">跑步配速计算器</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="space-y-8">
                            <PaceInput
                                minutes={minutes}
                                setMinutes={setMinutes}
                                seconds={seconds}
                                setSeconds={setSeconds}
                                inputMode={inputMode}
                                setInputMode={setInputMode}
                                calculatePace={calculatePace}
                                isPending={isPending}
                            />
                            <PaceStats {...paceStats} />
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="detailed-view"
                                    checked={isDetailedView}
                                    onCheckedChange={setIsDetailedView}
                                />
                                <Label htmlFor="detailed-view" className="text-base">
                                    显示详细公里表
                                </Label>
                            </div>
                            <PaceTable
                                isDetailedView={isDetailedView}
                                basePace={basePace}
                                paceTable={paceTable}
                                formatPace={formatPace}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppErrorBoundary>
    )
}
