import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { typeDescriptions } from '../constants'

interface ResultCardProps {
    result: keyof typeof typeDescriptions
    resetTest: () => void
    saveResult: () => void
}

export function ResultCard({ result, resetTest, saveResult }: ResultCardProps) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">你的MBTI类型是: {result}</CardTitle>
                <CardDescription className="text-lg">{typeDescriptions[result] || '个性化描述'}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
                <Button onClick={resetTest}>重新测试</Button>
                <Button onClick={saveResult} className="flex items-center gap-2">
                    <Save size={16} />
                    保存结果
                </Button>
            </CardFooter>
        </Card>
    )
}
