import { Progress } from '@/components/ui/progress'

interface TestProgressProps {
    completionRate: number
    answeredCount: number
    totalQuestions: number
    remainingQuestions: number
}

export function TestProgress({
    completionRate,
    answeredCount,
    totalQuestions,
    remainingQuestions,
}: TestProgressProps) {
    return (
        <div className="w-full mb-4">
            <Progress value={completionRate} />
            <div className="text-sm text-muted-foreground mt-2">
                已回答: {answeredCount}/{totalQuestions} | 剩余: {remainingQuestions} 题
            </div>
        </div>
    )
}
