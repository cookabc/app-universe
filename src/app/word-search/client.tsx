'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { GameErrorBoundary } from '@/components/optimized/error-boundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GameGrid } from './components/game-grid'
import { GameStats } from './components/game-stats'
import { GameStatus } from './components/game-status'
import { WordList } from './components/word-list'
import { COLORS, LEVELS } from './constants'
import { generateMatrix } from './lib/word-search'

export default function WordSearchClient() {
    const [currentLevel, setCurrentLevel] = useState(0)
    const [matrix, setMatrix] = useState<string[][]>([])
    const [remainingWords, setRemainingWords] = useState<string[]>([])
    const [foundWords, setFoundWords] = useState<{ word: string; cells: [number, number][]; color: string }[]>([])
    const [score, setScore] = useState(0)
    const [totalScore, setTotalScore] = useState(0)
    const [selectedCells, setSelectedCells] = useState<[number, number][]>([])
    const [isSelecting, setIsSelecting] = useState(false)
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'won' | 'completed'>('ready')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [_isPending, startTransition] = useTransition()

    const handleCellMouseDown = useCallback(
        (row: number, col: number) => {
            if (gameState !== 'playing') return
            startTransition(() => {
                setIsSelecting(true)
                setSelectedCells([[row, col]])
            })
        },
        [gameState],
    )

    const handleCellMouseEnter = useCallback(
        (row: number, col: number) => {
            if (isSelecting && gameState === 'playing') {
                startTransition(() => {
                    setSelectedCells((prev) => [...prev, [row, col]])
                })
            }
        },
        [isSelecting, gameState],
    )

    const handleCellMouseUp = useCallback(() => {
        if (gameState !== 'playing') return
        startTransition(() => {
            setIsSelecting(false)
            const selectedWord = selectedCells
                .map(([row, col]) => (matrix[row] && matrix[row][col] ? matrix[row][col] : ''))
                .join('')
            if (remainingWords.includes(selectedWord)) {
                setRemainingWords((prev) => prev.filter((word) => word !== selectedWord))
                setFoundWords((prev) => [
                    ...prev,
                    {
                        word: selectedWord,
                        cells: selectedCells,
                        color: COLORS[prev.length % COLORS.length] ?? '#000',
                    },
                ])
                const newScore = score + selectedWord.length * 10
                setScore(newScore)
                setTotalScore(totalScore + selectedWord.length * 10)
            }
            setSelectedCells([])
        })
    }, [gameState, selectedCells, matrix, remainingWords, score, totalScore])

    useEffect(() => {
        if (remainingWords.length === 0 && gameState === 'playing') {
            if (currentLevel < LEVELS.length - 1) {
                setGameState('won')
            } else {
                setGameState('completed')
            }
        }
    }, [remainingWords, gameState, currentLevel])

    const startLevel = (level: number) => {
        const levelObj = LEVELS[level]
        if (!levelObj) return
        const { words, size } = levelObj
        setRemainingWords([...words])
        setFoundWords([])
        setMatrix(generateMatrix(words, size))
        setScore(0)
        setGameState('playing')
    }

    const isCellSelected = (row: number, col: number) => {
        return selectedCells.some(([r, c]) => r === row && c === col)
    }

    const isCellFound = (row: number, col: number) => {
        return foundWords.some(({ cells }) => cells.some(([r, c]) => r === row && c === col))
    }

    const getCellColor = (row: number, col: number) => {
        const foundWord = foundWords.find(({ cells }) => cells.some(([r, c]) => r === row && c === col))
        return foundWord ? foundWord.color : ''
    }

    return (
        <GameErrorBoundary>
            <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-blue-500 to-purple-600">
                <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold">文字搜索挑战</CardTitle>
                        <p className="text-xl">主题：{LEVELS[currentLevel]?.theme}</p>
                        <p className="text-lg">
                            关卡：{currentLevel + 1} / {LEVELS.length}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <GameStats score={score} totalScore={totalScore} />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentLevel}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative"
                                >
                                    <canvas
                                        ref={canvasRef}
                                        width={LEVELS[currentLevel]?.size ? LEVELS[currentLevel]?.size * 52 : 0}
                                        height={LEVELS[currentLevel]?.size ? LEVELS[currentLevel]?.size * 52 : 0}
                                        className="absolute top-0 left-0 pointer-events-none"
                                    />
                                    <GameGrid
                                        matrix={matrix}
                                        isCellSelected={isCellSelected}
                                        isCellFound={isCellFound}
                                        getCellColor={getCellColor}
                                        handleCellMouseDown={handleCellMouseDown}
                                        handleCellMouseEnter={handleCellMouseEnter}
                                        handleCellMouseUp={handleCellMouseUp}
                                    />
                                </motion.div>
                            </AnimatePresence>
                            <WordList remainingWords={remainingWords} />
                            <GameStatus
                                gameState={gameState}
                                score={score}
                                totalScore={totalScore}
                                startLevel={startLevel}
                                currentLevel={currentLevel}
                                setCurrentLevel={setCurrentLevel}
                                setTotalScore={setTotalScore}
                            />
                        </div>
                    </CardContent>
                </Card>
            </main>
        </GameErrorBoundary>
    )
}
