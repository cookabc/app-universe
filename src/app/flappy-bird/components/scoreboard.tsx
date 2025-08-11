interface ScoreboardProps {
    score: number
    highScore: number
}

export function Scoreboard({ score, highScore }: ScoreboardProps) {
    return (
        <div className="mt-4 text-center">
            <p className="text-2xl font-bold mb-2 text-foreground">Score: {score}</p>
            <p className="text-xl mb-4 text-muted-foreground">High Score: {highScore}</p>
        </div>
    )
}
