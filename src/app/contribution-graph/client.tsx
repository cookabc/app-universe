'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { Graph } from './components/graph'
import { Legend } from './components/legend'
import { GraphInput } from './components/graph-input'

const MAX_INPUT_LENGTH = 10
const CANVAS_WIDTH = 60
const CANVAS_HEIGHT = 12
const FONT_SIZE = 9
const GRID_ROWS = 7
const GRID_COLUMNS = 53
const ALPHA_THRESHOLD = 100

export default function ContributionGraphClient() {
    const [inputText, setInputText] = useState<string>('BE SMART')
    const [gridData, setGridData] = useState<number[][]>([])
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [_isPending, startTransition] = useTransition()

    const graphStats = useMemo(
        () => ({
            totalCells: GRID_ROWS * GRID_COLUMNS,
            activeCells: gridData.flat().filter((cell) => cell > 0).length,
            maxLevel: Math.max(...gridData.flat(), 0),
            textLength: inputText.length,
            remainingChars: MAX_INPUT_LENGTH - inputText.length,
        }),
        [gridData, inputText.length],
    )

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value.slice(0, MAX_INPUT_LENGTH)
        startTransition(() => {
            setInputText(text)
        })
    }, [])

    const generateGridData = useCallback((imageData: ImageData) => {
        const data = imageData.data
        const grid: number[][] = []

        for (let y = 0; y < GRID_ROWS; y++) {
            const row: number[] = []
            for (let x = 0; x < imageData.width; x++) {
                const index = (y * imageData.width + x) * 4
                const alpha = data[index + 3]
                const contributionLevel =
                    typeof alpha === 'number' && alpha > ALPHA_THRESHOLD ? Math.floor(Math.random() * 4) + 1 : 0
                row.push(contributionLevel)
            }
            grid.push(row)
        }

        return grid
    }, [])

    useEffect(() => {
        if (!inputText) {
            setGridData([])
            return
        }

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return

        canvas.width = CANVAS_WIDTH
        canvas.height = CANVAS_HEIGHT

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.font = `${FONT_SIZE}px Arial`
        ctx.textBaseline = 'top'
        ctx.fillStyle = '#000000'
        ctx.fillText(inputText, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const grid = generateGridData(imageData)

        setGridData(grid)
    }, [inputText, generateGridData])

    return (
        <AppErrorBoundary>
            <div className="max-w-4xl mx-auto p-5 font-sans text-card-foreground">
                <h1 className="text-2xl font-light mb-4">GitHub Contribution Graph Generator</h1>
                <GraphInput
                    inputText={inputText}
                    handleChange={handleChange}
                    maxLength={MAX_INPUT_LENGTH}
                    remainingChars={graphStats.remainingChars}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div className="mt-5 overflow-x-auto">
                    <div className="flex border border-border rounded-md overflow-hidden mb-2">
                        <Graph gridData={gridData} />
                    </div>
                    <Legend />
                </div>
            </div>
        </AppErrorBoundary>
    )
}
