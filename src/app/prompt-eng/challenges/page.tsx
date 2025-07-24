'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Award, ChevronRight, Clock, HelpCircle, Save, Share2, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

const challenges = [
    {
        id: 1,
        title: '基础总结提示',
        description: '创建一个Prompt，生成关于Prompt Engineering的简短总结。',
        initialPrompt: '请简要总结Prompt Engineering的概念。',
        timeLimit: 180, // 3 minutes
        difficulty: '简单',
        hint: '考虑包含Prompt Engineering的定义、应用场景和主要技巧。',
    },
    {
        id: 2,
        title: '个性化学习计划',
        description: '优化Prompt以生成针对初学者的个性化Prompt Engineering学习计划。',
        initialPrompt: '为Prompt Engineering初学者创建一个为期一周的学习计划。',
        timeLimit: 240, // 4 minutes
        difficulty: '中等',
        hint: '考虑学习者的起点、每天的学习时间、理论与实践的平衡。',
    },
    {
        id: 3,
        title: '多语言翻译优化',
        description: '创建一个Prompt，使AI能够更准确地进行多语言翻译，特别是处理俚语和习语。',
        initialPrompt: '设计一个Prompt，使AI在翻译时能准确处理英语俚语到中文的转换。',
        timeLimit: 300, // 5 minutes
        difficulty: '中等',
        hint: '考虑提供一些常见俚语例子，并要求AI解释翻译过程。',
    },
    {
        id: 4,
        title: '创意写作增强',
        description: '优化Prompt以生成更有创意和吸引力的故事开头。',
        initialPrompt: '创建一个Prompt，使AI生成一个科幻故事的引人入胜的开头段落。',
        timeLimit: 360, // 6 minutes
        difficulty: '困难',
        hint: '考虑指定一些关键元素，如设定、主角特征、冲突等。',
    },
    {
        id: 5,
        title: '代码解释与优化',
        description: '设计一个Prompt，使AI能够解释复杂的代码片段并提供优化建议。',
        initialPrompt: '创建一个Prompt，使AI能够解释一段Python递归函数并提供优化建议。',
        timeLimit: 420, // 7 minutes
        difficulty: '困难',
        hint: '考虑要求AI分步骤解释代码，并从时间复杂度和空间复杂度两个角度提供优化建议。',
    },
]

type PerformanceData = {
    challenge: number
    score: number
    timeLimit: number
    attempts: number
}

export default function ChallengePage() {
    const [currentChallenge, setCurrentChallenge] = useState(0)
    const [userPrompt, setUserPrompt] = useState(challenges[currentChallenge]?.initialPrompt ?? '')
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(challenges[currentChallenge]?.timeLimit ?? 0)
    const [attempts, setAttempts] = useState(0)
    const [feedback, setFeedback] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showSummary, setShowSummary] = useState(false)
    const [_showHint, setShowHint] = useState(false)
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])

    const router = useRouter()

    useEffect(() => {
        const savedProgress = localStorage.getItem('challengeProgress')
        if (savedProgress) {
            const { currentChallenge, score, attempts } = JSON.parse(savedProgress)
            setCurrentChallenge(currentChallenge)
            setScore(score)
            setAttempts(attempts)
            setUserPrompt(challenges[currentChallenge]?.initialPrompt ?? '')
            setTimeLeft(challenges[currentChallenge]?.timeLimit ?? 0)
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        localStorage.setItem('challengeProgress', JSON.stringify({ currentChallenge, score, attempts }))
    }, [currentChallenge, score, attempts])

    const handleSubmit = () => {
        // 这里应该有一个API调用来评估Prompt的质量
        // 现在我们用一个模拟的评分系统
        const promptScore = Math.floor(Math.random() * 100)
        const timeLimit = challenges[currentChallenge]?.timeLimit ?? 1
        const timeBonus = Math.floor((timeLeft / timeLimit) * 50)
        const totalScore = promptScore + timeBonus

        setScore((prevScore) => prevScore + totalScore)
        setAttempts((prevAttempts) => prevAttempts + 1)
        setIsSubmitted(true)

        setPerformanceData((prevData) => [
            ...prevData,
            {
                challenge: currentChallenge + 1,
                score: totalScore,
                timeLimit: challenges[currentChallenge]?.timeLimit ?? 0,
                attempts: attempts + 1,
            },
        ])

        if (promptScore < 50) {
            setFeedback('你的Prompt还需要改进。考虑以下几点：\n1. 使指令更具体\n2. 提供更多上下文\n3. 明确输出格式')
        } else if (promptScore < 80) {
            setFeedback(
                '不错的尝试！你的Prompt已经很好了，但还可以更精确。考虑：\n1. 添加一些约束条件\n2. 指定目标受众\n3. 要求AI解释其推理过程',
            )
        } else {
            setFeedback(
                '太棒了！你的Prompt非常出色。它具有：\n1. 清晰的指令\n2. 充分的上下文\n3. 明确的输出要求\n4. 适当的约束',
            )
        }

        toast({
            title: '提交成功！',
            description: `你获得了 ${totalScore} 分！`,
        })
    }

    const handleNextChallenge = () => {
        if (currentChallenge < challenges.length - 1) {
            setCurrentChallenge((prev) => prev + 1)
            setUserPrompt(challenges[currentChallenge + 1]?.initialPrompt ?? '')
            setTimeLeft(challenges[currentChallenge + 1]?.timeLimit ?? 0)
            setAttempts(0)
            setFeedback('')
            setIsSubmitted(false)
            setShowHint(false)
        } else {
            setShowSummary(true)
        }
    }

    const handleShare = () => {
        const shareText = `我在Prompt工程师训练营中获得了${score}分！来挑战我吧！`
        if (navigator.share) {
            navigator.share({
                title: 'Prompt工程师训练营挑战',
                text: shareText,
                url: window.location.href,
            })
        } else {
            // 如果浏览器不支持原生分享，可以复制到剪贴板
            navigator.clipboard.writeText(shareText).then(() => {
                toast({
                    title: '分享文本已复制',
                    description: '你可以将它粘贴到社交媒体上分享。',
                })
            })
        }
    }

    const handleHome = () => {
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-center mb-8">Prompt工程师挑战</h1>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!showSummary ? (
                        <motion.div
                            key="challenge"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>{challenges[currentChallenge]?.title ?? ''}</CardTitle>
                                    <CardDescription>{challenges[currentChallenge]?.description ?? ''}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center">
                                            <Star className="text-yellow-500 mr-2" />
                                            <span className="font-bold">{score}分</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="text-blue-500 mr-2" />
                                            <span className="font-bold">
                                                {Math.floor(timeLeft / 60)}:
                                                {(timeLeft % 60).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                    <Progress
                                        value={((currentChallenge + 1) / challenges.length) * 100}
                                        className="mb-4"
                                    />
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">
                                            难度：{challenges[currentChallenge]?.difficulty ?? ''}
                                        </span>
                                        <span className="text-sm font-medium">
                                            挑战 {currentChallenge + 1}/{challenges.length}
                                        </span>
                                    </div>
                                    <Textarea
                                        placeholder="在这里输入你的Prompt..."
                                        value={userPrompt}
                                        onChange={(e) => setUserPrompt(e.target.value)}
                                        className="mb-4"
                                        rows={5}
                                    />
                                    <div className="flex justify-between mb-4">
                                        <Button onClick={handleSubmit} disabled={isSubmitted || timeLeft === 0}>
                                            提交Prompt
                                        </Button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" onClick={() => setShowHint(true)}>
                                                    <HelpCircle className="mr-2 h-4 w-4" />
                                                    提示
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>提示</DialogTitle>
                                                    <DialogDescription>
                                                        {challenges[currentChallenge]?.hint ?? ''}
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    {feedback && (
                                        <div
                                            className={`p-4 rounded-md mb-4 ${isSubmitted ? 'bg-green-100' : 'bg-yellow-100'}`}
                                        >
                                            <p className="font-semibold mb-2">反馈：</p>
                                            <p className="whitespace-pre-line">{feedback}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-500">尝试次数: {attempts}</p>
                                        {isSubmitted && (
                                            <Button onClick={handleNextChallenge}>
                                                {currentChallenge === challenges.length - 1 ? '查看总结' : '下一个挑战'}{' '}
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Award className="mr-2 h-6 w-6 text-yellow-500" />
                                        挑战完成！
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4">恭喜你完成了所有的挑战！你的最终得分是 {score} 分。</p>
                                    <div className="h-64 mb-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={performanceData}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="challenge" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="score"
                                                    stroke="#8884d8"
                                                    activeDot={{ r: 8 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="mb-4">
                                        你在Prompt工程方面展现出了卓越的技能。继续练习和实验，你会成为一名出色的Prompt工程师！
                                    </p>
                                    <div className="flex justify-between mb-4">
                                        <Button variant="outline" onClick={handleShare}>
                                            <Share2 className="mr-2 h-4 w-4" />
                                            分享成绩
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => localStorage.removeItem('challengeProgress')}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            重置进度
                                        </Button>
                                    </div>
                                    <Button className="w-full" onClick={handleHome}>
                                        返回主页
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
