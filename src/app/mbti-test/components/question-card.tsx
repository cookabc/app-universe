import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import type { Question } from '../types'

interface QuestionCardProps {
    question: Question
    handleAnswer: (value: string) => void
    currentQuestionIndex: number
    totalQuestions: number
    setCurrentQuestion: (index: number) => void
    answers: Record<number, string>
    calculateResult: () => void
}

export function QuestionCard({
    question,
    handleAnswer,
    currentQuestionIndex,
    totalQuestions,
    setCurrentQuestion,
    answers,
    calculateResult,
}: QuestionCardProps) {
    return (
        <CardContent>
            <form>
                <div className="space-y-4">
                    <Label className="text-lg">{question.text}</Label>
                    <RadioGroup onValueChange={handleAnswer} value={answers[currentQuestionIndex] ?? null}>
                        {question.options.map((option, index) => (
                            <div key={`${question.id}-${index}`} className="flex items-center space-x-2">
                                <RadioGroupItem value={index.toString()} id={`option${question.id}-${index}`} />
                                <Label htmlFor={`option${question.id}-${index}`} className="text-base">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </form>
            <CardFooter className="flex justify-between mt-6">
                <Button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2"
                >
                    <AlertCircle size={16} />
                    上一题
                </Button>
                <Button
                    onClick={() => {
                        const hasAnswer = answers[currentQuestionIndex] !== undefined
                        if (!hasAnswer) return
                        if (currentQuestionIndex === totalQuestions - 1) {
                            calculateResult()
                        } else {
                            setCurrentQuestion(currentQuestionIndex + 1)
                        }
                    }}
                    disabled={answers[currentQuestionIndex] === undefined}
                    className="flex items-center gap-2"
                >
                    {currentQuestionIndex === totalQuestions - 1 ? '查看结果' : '下一题'}
                    <AlertCircle size={16} />
                </Button>
            </CardFooter>
        </CardContent>
    )
}
