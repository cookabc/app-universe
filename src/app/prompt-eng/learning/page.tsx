'use client'

import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, ChevronRight, Clock, Save, Share2, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

const knowledgePoints = [
    {
        title: '关键词提取',
        description: '学习如何从文本中提取关键词，这是总结的第一步。',
        example: "原文: '苹果公司发布了新款iPhone，搭载最新的A15处理器。'\n关键词: 苹果公司、iPhone、A15处理器",
        task: "从以下文本中提取关键词:\n'特斯拉推出了新的电动汽车模型，续航里程可达600公里。'",
        answer: ['特斯拉', '电动汽车', '续航里程', '600公里'],
        explanation:
            '在这个例子中，关键词包括产品（特斯拉、电动汽车）、特性（续航里程）和具体数据（600公里）。这些词概括了文本的主要信息。',
    },
    {
        title: '主题句识别',
        description: '学习如何识别段落中的主题句，这通常包含了段落的主要信息。',
        example:
            "段落: '城市化带来了许多挑战。交通拥堵日益严重，空气污染问题突出，住房价格不断上涨。然而，城市化也带来了更多的就业机会和经济发展。'\n主题句: '城市化带来了许多挑战。'",
        task: "从以下段落中识别主题句:\n'人工智能正在改变我们的生活方式。它在医疗诊断、自动驾驶和个人助理等领域都有广泛应用。尽管如此，人工智能的发展也带来了一些伦理问题需要我们关注。'",
        answer: '人工智能正在改变我们的生活方式。',
        explanation:
            '主题句通常出现在段落的开头，概括了整个段落的主要内容。在这个例子中，第一句话概括了人工智能的影响，后面的句子则是对这个主题的具体展开。',
    },
    {
        title: '信息压缩',
        description: '学习如何将长文本压缩成简短的摘要，保留核心信息。',
        example:
            "原文: '近年来，可再生能源发展迅速。太阳能和风能成本不断下降，使得它们在许多地区已经比传统化石燃料更具经济性。然而，储能技术的发展仍然是一个挑战，需要进一步的技术突破来解决间歇性问题。'\n摘要: '可再生能源发展迅速，成本下降，但储能技术仍需突破。'",
        task: "将以下文本压缩成一句话摘要:\n'全球变暖正在影响地球的生态系统。冰川融化导致海平面上升，威胁沿海地区。极端天气事件如热浪和飓风变得更加频繁。许多物种面临灭绝风险。科学家呼吁采取紧急行动减少温室气体排放。'",
        answer: '全球变暖威胁生态系统，科学家呼吁减少温室气体排放。',
        explanation:
            '一个好的摘要应该包含原文的主要观点和关键信息。在这个例子中，我们保留了全球变暖的主要影响（威胁生态系统）和科学家的呼吁（减少温室气体排放），这两点概括了原文的核心内容。',
    },
]

export default function LearningModule() {
    const [currentStep, setCurrentStep] = useState(0)
    const [userInput, setUserInput] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [difficulty, setDifficulty] = useState('normal')
    const [showExplanation, setShowExplanation] = useState(false)

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        }
        if (timeLeft === 0) {
            handleTimeUp()
        }
    }, [timeLeft, isTimerRunning, handleTimeUp])

    const handleStartLearning = () => {
        setIsTimerRunning(true)
        // 根据难度设置时间
        setTimeLeft(difficulty === 'easy' ? 420 : difficulty === 'hard' ? 180 : 300)
    }

    const handleTimeUp = () => {
        setIsTimerRunning(false)
        toast({
            title: '时间到！',
            description: '别担心，你还可以继续学习，但不会获得额外的时间奖励。',
            variant: 'destructive',
        })
    }

    const handleNextStep = () => {
        if (currentStep < knowledgePoints.length - 1) {
            setCurrentStep(currentStep + 1)
            setUserInput('')
            setShowExplanation(false)
        } else {
            setShowSuccess(true)
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
            toast({
                title: '恭喜!',
                description: `你已经完成了总结模块的学习！最终得分：${score}`,
            })
        }
    }

    const handleSubmit = () => {
        const currentPoint = knowledgePoints[currentStep]
        let isCorrect = false
        let feedback = ''

        if (Array.isArray(currentPoint.answer)) {
            const userKeywords = userInput.toLowerCase().split(/[,，\s]+/)
            const correctKeywords = currentPoint.answer.map((keyword) => keyword.toLowerCase())
            const matchedKeywords = userKeywords.filter((keyword) => correctKeywords.includes(keyword))
            isCorrect = matchedKeywords.length >= correctKeywords.length * 0.7 // 70% 匹配率视为正确
            feedback = isCorrect ? '很好！你提取了大部分关键词。' : '再试试看，还有一些关键词没有提取出来。'
        } else {
            isCorrect = userInput.toLowerCase().includes(currentPoint.answer.toLowerCase())
            feedback = isCorrect ? '回答正确！' : '再想想，试着找出最重要的信息。'
        }

        if (isCorrect) {
            const timeBonus = Math.floor(timeLeft / 10)
            const difficultyBonus = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 15 : 10
            const newScore = score + difficultyBonus + timeBonus
            setScore(newScore)
            toast({
                title: '答对了！',
                description: `+${difficultyBonus}分 ${timeBonus > 0 ? `+${timeBonus}分(时间奖励)` : ''}`,
            })
        } else {
            toast({
                title: '继续努力！',
                description: feedback,
                variant: 'destructive',
            })
        }

        setShowExplanation(true)
    }

    const handleSaveProgress = () => {
        // 这里应该有保存进度到服务器的逻辑
        localStorage.setItem(
            'learningProgress',
            JSON.stringify({
                currentStep,
                score,
                timeLeft,
                difficulty,
            }),
        )
        toast({
            title: '进度已保存',
            description: '你可以稍后继续学习。',
        })
    }

    const handleShare = () => {
        // 这里应该有分享到社交媒体的逻辑
        const _shareText = `我在Prompt工程师训练营中获得了${score}分！来挑战我吧！`
        toast({
            title: '分享成功',
            description: '你的成绩已经分享到社交媒体。',
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-center mb-8">总结模块: 学习如何提取和压缩关键信息</h1>
                </motion.div>

                {!isTimerRunning && !showSuccess && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>准备好开始学习了吗？</CardTitle>
                            <CardDescription>选择难度并开始你的学习之旅！</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select onValueChange={setDifficulty} defaultValue={difficulty}>
                                <SelectTrigger className="w-full mb-4">
                                    <SelectValue placeholder="选择难度" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">简单 (7分钟)</SelectItem>
                                    <SelectItem value="normal">普通 (5分钟)</SelectItem>
                                    <SelectItem value="hard">困难 (3分钟)</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleStartLearning} className="w-full">
                                开始学习
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {isTimerRunning && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <Star className="text-yellow-500 mr-2" />
                                <span className="font-bold">{score}分</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="text-blue-500 mr-2" />
                                <span className="font-bold">
                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        <Progress value={((currentStep + 1) / knowledgePoints.length) * 100} className="mb-8" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="mb-8">
                                    <CardHeader>
                                        <CardTitle>{knowledgePoints[currentStep].title}</CardTitle>
                                        <CardDescription>{knowledgePoints[currentStep].description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <h3 className="font-semibold mb-2">示例:</h3>
                                        <p className="mb-4 whitespace-pre-wrap">
                                            {knowledgePoints[currentStep].example}
                                        </p>
                                        <h3 className="font-semibold mb-2">练习:</h3>
                                        <p className="mb-4">{knowledgePoints[currentStep].task}</p>
                                        <Textarea
                                            placeholder="在这里输入你的答案..."
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            className="mb-4"
                                        />
                                        <Button onClick={handleSubmit} className="w-full mb-4">
                                            提交答案
                                        </Button>
                                        {showExplanation && (
                                            <div className="bg-blue-100 p-4 rounded-md">
                                                <h4 className="font-semibold mb-2">答案解析:</h4>
                                                <p>{knowledgePoints[currentStep].explanation}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </AnimatePresence>

                        {!showSuccess && (
                            <div className="flex justify-between items-center">
                                <Button variant="outline" onClick={handleSaveProgress}>
                                    <Save className="mr-2 h-4 w-4" /> 保存进度
                                </Button>
                                <Button onClick={handleNextStep} disabled={currentStep === knowledgePoints.length - 1}>
                                    下一步 <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}

                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                        >
                            <Card className="w-96">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Award className="mr-2 h-6 w-6 text-yellow-500" />
                                        恭喜!
                                    </CardTitle>
                                    <CardDescription>你已经完成了总结模块的学习!</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4">你获得了 {score} 积分和"总结大师"勋章!</p>
                                    <div className="flex justify-between mb-4">
                                        <Button variant="outline" onClick={handleShare}>
                                            <Share2 className="mr-2 h-4 w-4" /> 分享成绩
                                        </Button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">查看详细解析</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>学习模块详细解析</DialogTitle>
                                                    <DialogDescription>
                                                        以下是本模块的所有知识点及其解析：
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {knowledgePoints.map((point, _index) => (
                                                    <div key={point.title} className="mb-4">
                                                        <h3 className="font-semibold">{point.title}</h3>
                                                        <p>{point.explanation}</p>
                                                    </div>
                                                ))}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <Button onClick={() => setShowSuccess(false)} className="w-full">
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
