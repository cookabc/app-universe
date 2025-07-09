'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const DISTANCES = [
    { value: 1, label: '1公里' },
    { value: 2, label: '2公里' },
    { value: 3, label: '3公里' },
    { value: 4, label: '4公里' },
    { value: 5, label: '5公里' },
    { value: 6, label: '6公里' },
    { value: 7, label: '7公里' },
    { value: 8, label: '8公里' },
    { value: 9, label: '9公里' },
    { value: 10, label: '10公里' },
    { value: 15, label: '15公里' },
    { value: 20, label: '20公里' },
    { value: 21.1, label: '半马' },
    { value: 25, label: '25公里' },
    { value: 30, label: '30公里' },
    { value: 35, label: '35公里' },
    { value: 40, label: '40公里' },
    { value: 42.2, label: '全马' },
    { value: 45, label: '45公里' },
    { value: 50, label: '50公里' },
]

export default function PaceCalculator() {
    const [minutes, setMinutes] = useState('5')
    const [seconds, setSeconds] = useState('00')
    const [paceTable, setPaceTable] = useState<string[][]>([])
    const [isDetailedView, setIsDetailedView] = useState(false)
    const [basePace, setBasePace] = useState(300) // 5:00 min/km in seconds
    const [inputMode, setInputMode] = useState<'select' | 'input'>('select')

    const calculatePace = () => {
        const baseSeconds = parseInt(minutes) * 60 + parseInt(seconds)
        setBasePace(baseSeconds)
    }

    useEffect(() => {
        calculatePaceTable()
    }, [basePace, isDetailedView])

    const formatPace = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const calculateTime = (distance: number, paceSeconds: number) => {
        const totalSeconds = distance * paceSeconds
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = Math.round(totalSeconds % 60)

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const calculatePaceTable = () => {
        const paces = [-10, -5, 0, 5, 10].map((diff) => basePace + diff)
        const filteredDistances = isDetailedView
            ? DISTANCES
            : DISTANCES.filter((d) => d.value % 5 === 0 || d.value === 21.1 || d.value === 42.2)

        const table = filteredDistances.map((distance) => {
            return paces.map((pace) => calculateTime(distance.value, pace))
        })
        setPaceTable(table)
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) < 60)) {
            setMinutes(value)
        }
    }

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) < 60)) {
            setSeconds(value.padStart(2, '0'))
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card className="border-0 shadow-none">
                <CardHeader className="px-0">
                    <CardTitle className="text-3xl font-bold">跑步配速计算器</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-6">预期配速</h2>
                            <div className="flex gap-6 items-end mb-6">
                                <div className="space-y-2">
                                    <Label htmlFor="minutes" className="text-base">
                                        分
                                    </Label>
                                    {inputMode === 'select' ? (
                                        <Select value={minutes} onValueChange={setMinutes}>
                                            <SelectTrigger
                                                id="minutes"
                                                className="w-[100px]"
                                                onClick={() => setInputMode('input')}
                                            >
                                                <SelectValue placeholder="分" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 15 }, (_, i) => (
                                                    <SelectItem key={i} value={i.toString()}>
                                                        {i}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            type="number"
                                            value={minutes}
                                            onChange={handleMinutesChange}
                                            className="w-[100px]"
                                            onBlur={() => minutes === '' && setMinutes('0')}
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="seconds" className="text-base">
                                        秒
                                    </Label>
                                    {inputMode === 'select' ? (
                                        <Select value={seconds} onValueChange={(v) => setSeconds(v.padStart(2, '0'))}>
                                            <SelectTrigger
                                                id="seconds"
                                                className="w-[100px]"
                                                onClick={() => setInputMode('input')}
                                            >
                                                <SelectValue placeholder="秒" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 60 }, (_, i) => (
                                                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                                                        {i.toString().padStart(2, '0')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            type="number"
                                            value={parseInt(seconds)}
                                            onChange={handleSecondsChange}
                                            className="w-[100px]"
                                            onBlur={() => seconds === '' && setSeconds('00')}
                                        />
                                    )}
                                </div>
                                <Button onClick={calculatePace} className="bg-black text-white hover:bg-black/90">
                                    计算
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="detailed-view" checked={isDetailedView} onCheckedChange={setIsDetailedView} />
                            <Label htmlFor="detailed-view" className="text-base">
                                显示详细公里表
                            </Label>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[150px]">距离</TableHead>
                                        {[-10, -5, 0, 5, 10].map((diff) => (
                                            <TableHead key={diff}>{formatPace(basePace + diff)}/公里</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(isDetailedView
                                        ? DISTANCES
                                        : DISTANCES.filter(
                                              (d) => d.value % 5 === 0 || d.value === 21.1 || d.value === 42.2,
                                          )
                                    ).map((distance, i) => (
                                        <TableRow
                                            key={distance.value}
                                            className={`
                        hover:bg-transparent
                        ${distance.value === 21.1 || distance.value === 42.2 ? 'bg-slate-50' : ''}
                      `}
                                        >
                                            <TableCell className="font-medium">{distance.label}</TableCell>
                                            {paceTable[i]?.map((time, j) => (
                                                <TableCell key={j}>{time}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
