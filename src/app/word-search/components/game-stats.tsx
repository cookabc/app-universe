import { Star, Trophy } from 'lucide-react'

interface GameStatsProps {
    score: number
    totalScore: number
}

export function GameStats({ score, totalScore }: GameStatsProps) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Star className="text-yellow-300" />
                <span className="text-2xl font-bold">本关得分：{score}</span>
            </div>
            <div className="flex items-center gap-2">
                <Trophy className="text-yellow-300" />
                <span className="text-2xl font-bold">总得分：{totalScore}</span>
            </div>
        </div>
    )
}
