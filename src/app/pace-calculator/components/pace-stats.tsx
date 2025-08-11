interface PaceStatsProps {
    paceLevel: string
    fiveKTime: string
    tenKTime: string
    halfMarathonTime: string
    marathonTime: string
}

export function PaceStats({ paceLevel, fiveKTime, tenKTime, halfMarathonTime, marathonTime }: PaceStatsProps) {
    return (
        <div className="bg-muted rounded-md p-4">
            <h4 className="font-medium mb-2 text-foreground">配速统计 ({paceLevel}):</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div>5K: {fiveKTime}</div>
                <div>10K: {tenKTime}</div>
                <div>半马: {halfMarathonTime}</div>
                <div>全马: {marathonTime}</div>
            </div>
        </div>
    )
}
