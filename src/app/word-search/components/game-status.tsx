import { Button } from '@/components/ui/button'
import { ArrowRight, Trophy } from 'lucide-react'

interface GameStatusProps {
    gameState: 'ready' | 'playing' | 'won' | 'completed'
    score: number
    totalScore: number
    startLevel: (level: number) => void
    currentLevel: number
    setCurrentLevel: (level: number) => void
    setTotalScore: (score: number) => void
}

export function GameStatus({
    gameState,
    score,
    totalScore,
    startLevel,
    currentLevel,
    setCurrentLevel,
    setTotalScore,
}: GameStatusProps) {
    if (gameState === 'ready') {
        return (
            <Button onClick={() => startLevel(currentLevel)} size="lg" className="bg-green-500 hover:bg-green-600">
                开始游戏
            </Button>
        )
    }
    if (gameState === 'playing') {
        return (
            <Button onClick={() => startLevel(currentLevel)} size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                重新开始本关
            </Button>
        )
    }
    if (gameState === 'won') {
        return (
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                    <span className="flex items-center justify-center gap-2">
                        <Trophy className="text-yellow-300" />
                        恭喜你通过本关！
                    </span>
                </h2>
                <p className="text-xl mb-4">你的得分：{score}</p>
                <Button
                    onClick={() => {
                        setCurrentLevel(currentLevel + 1)
                        startLevel(currentLevel + 1)
                    }}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600"
                >
                    <ArrowRight className="mr-2 h-4 w-4" /> 进入下一关
                </Button>
            </div>
        )
    }
    if (gameState === 'completed') {
        return (
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                    <span className="flex items-center justify-center gap-2">
                        <Trophy className="text-yellow-300" />
                        恭喜你完成所有关卡！
                    </span>
                </h2>
                <p className="text-xl mb-4">你的总得分：{totalScore}</p>
                <Button
                    onClick={() => {
                        setCurrentLevel(0)
                        setTotalScore(0)
                        startLevel(0)
                    }}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600"
                >
                    重新开始游戏
                </Button>
            </div>
        )
    }
    return null
}
