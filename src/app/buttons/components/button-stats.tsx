interface ButtonStatsProps {
    totalButtons: number
    clickedCount: number
    completionRate: number
}

export function ButtonStats({ totalButtons, clickedCount, completionRate }: ButtonStatsProps) {
    return (
        <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Interactive Button Showcase</h1>
            <div className="text-sm text-muted-foreground space-x-4">
                <span>Total: {totalButtons}</span>
                <span>Clicked: {clickedCount}</span>
                <span>Progress: {completionRate}%</span>
            </div>
        </div>
    )
}
