'use client'

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { getCachedQuestions } from '@/app/actions'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { QuestionCard } from './components/question-card'
import { ResultCard } from './components/result-card'
import { TestProgress } from './components/test-progress'
import { defaultQuestions, typeDescriptions } from './constants'
import type { Question } from './types'

export default function MBTITestClient() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [result, setResult] = useState<keyof typeof typeDescriptions | ''>('')
    const [questions, setQuestions] = useState<Question[]>(defaultQuestions)
    const [useLLM, setUseLLM] = useState(false)
    const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)

    const [_isPending, startTransition] = useTransition()

    const testStats = useMemo(() => {
        const answeredCount = Object.keys(answers).length
        const completionRate = (answeredCount / questions.length) * 100
        const remainingQuestions = questions.length - answeredCount

        return {
            answeredCount,
            completionRate,
            remainingQuestions,
            isComplete: answeredCount === questions.length,
        }
    }, [answers, questions.length])

    useEffect(() => {
        const savedResult = localStorage.getItem('mbtiResult')
        if (savedResult) {
            setResult(JSON.parse(savedResult))
        }
    }, [])

    useEffect(() => {
        if (useLLM) {
            void generateLLMQuestions()
        } else {
            resetQuestions()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useLLM])

    const resetAnswers = () => {
        setAnswers({})
        setCurrentQuestion(0)
    }

    const resetQuestions = () => {
        setQuestions(defaultQuestions)
        resetAnswers()
    }

    const generateLLMQuestions = useCallback(async () => {
        setIsGeneratingQuestions(true)
        try {
            const result = await getCachedQuestions('Generate 12 MBTI test questions with options in Chinese')
            if (result) {
                setQuestions(result.questions)
            }
            resetAnswers()
        } catch (error) {
            // handle error
        } finally {
            setIsGeneratingQuestions(false)
        }
    }, [])

    const calculateResult = useCallback(() => {
        const types = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
        for (const [questionId, answer] of Object.entries(answers)) {
            const question = questions[Number(questionId)]
            if (question) {
                const typeKey = question.type[answer === '0' ? 0 : 1] as keyof typeof types
                types[typeKey]++
            }
        }
        const mbtiType = `${types.E > types.I ? 'E' : 'I'}${types.S > types.N ? 'S' : 'N'}${types.T > types.F ? 'T' : 'F'}${types.J > types.P ? 'J' : 'P'}`
        setResult(mbtiType)
        localStorage.setItem('mbtiResult', JSON.stringify(mbtiType))
    }, [answers, questions])

    const handleAnswer = useCallback(
        (value: string) => {
            startTransition(() => {
                setAnswers({ ...answers, [currentQuestion]: value })
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1)
                } else {
                    calculateResult()
                }
            })
        },
        [answers, currentQuestion, questions.length, calculateResult],
    )

    const resetTest = () => {
        resetAnswers()
        setResult('')
        localStorage.removeItem('mbtiResult')
    }

    const saveResult = () => {
        if (result) {
            localStorage.setItem('mbtiResult', JSON.stringify(result))
            alert('结果已保存！')
        }
    }

    if (result) {
        return (
            <AppErrorBoundary>
                <ResultCard result={result} resetTest={resetTest} saveResult={saveResult} />
            </AppErrorBoundary>
        )
    }

    return (
        <AppErrorBoundary>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">MBTI人格测试</CardTitle>
                    <CardDescription className="text-lg">
                        问题 {currentQuestion + 1} / {questions.length}
                    </CardDescription>
                    <div className="flex items-center space-x-2 mt-4">
                        <Switch
                            id="use-llm"
                            checked={useLLM}
                            onCheckedChange={setUseLLM}
                            disabled={isGeneratingQuestions}
                        />
                        <Label
                            htmlFor="use-llm"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            使用AI生成问题
                        </Label>
                    </div>
                </CardHeader>
                <TestProgress {...testStats} totalQuestions={questions.length} />
                {isGeneratingQuestions ? (
                    <div className="text-center p-6" role="status" aria-live="polite">
                        正在生成问题，请稍候...
                    </div>
                ) : (
                    <QuestionCard
                        question={questions[currentQuestion]}
                        handleAnswer={handleAnswer}
                        currentQuestionIndex={currentQuestion}
                        totalQuestions={questions.length}
                        setCurrentQuestion={setCurrentQuestion}
                        answers={answers}
                        calculateResult={calculateResult}
                    />
                )}
            </Card>
        </AppErrorBoundary>
    )
}
