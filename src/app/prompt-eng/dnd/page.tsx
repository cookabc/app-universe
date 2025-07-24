'use client'

import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Clock, HelpCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const moduleTypes: Record<string, { color: string; name: string }> = {
    action: { color: 'bg-blue-200', name: '指令模块' },
    object: { color: 'bg-green-200', name: '对象模块' },
    condition: { color: 'bg-red-200', name: '条件模块' },
    style: { color: 'bg-purple-200', name: '风格模块' },
    format: { color: 'bg-yellow-200', name: '格式模块' },
}

const predefinedModules: Record<string, string>[] = [
    { id: 'summarize', content: 'Summarize', type: 'action' },
    { id: 'explain', content: 'Explain', type: 'action' },
    { id: 'generate', content: 'Generate', type: 'action' },
    { id: 'this-article', content: 'this article', type: 'object' },
    { id: 'the-review', content: 'the review', type: 'object' },
    { id: 'the-conversation', content: 'the conversation', type: 'object' },
    {
        id: 'if-more-than-100-words',
        content: 'if more than 100 words',
        type: 'condition',
    },
    {
        id: 'only-for-positive-reviews',
        content: 'only for positive reviews',
        type: 'condition',
    },
    {
        id: 'for-reviews-above-4-stars',
        content: 'for reviews above 4 stars',
        type: 'condition',
    },
    { id: 'in-formal-style', content: 'in formal style', type: 'style' },
    { id: 'in-one-sentence', content: 'in one sentence', type: 'style' },
    { id: 'with-key-points', content: 'with key points', type: 'style' },
    { id: 'as-a-bulleted-list', content: 'as a bulleted list', type: 'format' },
    { id: 'in-a-table', content: 'in a table', type: 'format' },
]

const levels = [
    {
        id: 1,
        name: '新手关卡：基本 Prompt 生成',
        description: '生成一个总结提示，拖拽 Summarize + this article + in one sentence 模块，拼接出完整的 Prompt。',
        availableModules: ['summarize', 'this-article', 'in-one-sentence'],
        targetPrompt: 'Summarize this article in one sentence',
        tutorial:
            '欢迎来到 Prompt Engineering 游戏！在这个关卡中，你需要创建一个简单的 Prompt 来总结文章。从左侧的模块库中拖拽模块到中间的拼搭区，然后按正确的顺序排列它们。',
    },
    {
        id: 2,
        name: '中级关卡：引入条件',
        description: '生成一个仅在文章超过 100 字时执行的总结提示。',
        availableModules: ['summarize', 'this-article', 'if-more-than-100-words', 'in-one-sentence'],
        targetPrompt: 'Summarize this article in one sentence if more than 100 words',
        tutorial:
            '在这个关卡中，我们引入了条件模块。你需要创建一个 Prompt，只有当文章超过 100 字时才会执行总结。注意条件模块的位置！',
    },
    {
        id: 3,
        name: '高级关卡：复杂组合',
        description: '生成一个针对 4 星以上评论的正式总结，并以要点形式呈现。',
        availableModules: [
            'summarize',
            'the-review',
            'for-reviews-above-4-stars',
            'in-formal-style',
            'with-key-points',
        ],
        targetPrompt: 'Summarize the review in formal style with key points for reviews above 4 stars',
        tutorial:
            '这是一个更具挑战性的关卡！你需要组合多个模块来创建一个复杂的 Prompt。注意模块的顺序和使用的模块类型。',
    },
]

const achievements = [
    {
        id: 'first_level',
        name: '初出茅庐',
        description: '完成第一个关卡',
        icon: '🌟',
    },
    {
        id: 'all_levels',
        name: '登峰造极',
        description: '完成所有关卡',
        icon: '🏆',
    },
    {
        id: 'speed_demon',
        name: '闪电手',
        description: '在 30 秒内完成一个关卡',
        icon: '⚡',
    },
    {
        id: 'perfectionist',
        name: '完美主义者',
        description: '获得 3 个满分关卡',
        icon: '💯',
    },
]

export default function PromptEngineeringGame() {
    const [currentLevel, setCurrentLevel] = useState(0)
    const [availableModules, setAvailableModules] = useState<Record<string, string>[]>([])
    const [prompts, setPrompts] = useState<Record<string, string>[]>([])
    const [feedback, setFeedback] = useState('')
    const [score, setScore] = useState(0)
    const [difficulty, setDifficulty] = useState('normal')
    const [timerMode, setTimerMode] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60)
    const [isGameOver, setIsGameOver] = useState(false)
    const [_showTutorial, setShowTutorial] = useState(true)
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])

    useEffect(() => {
        loadLevel(currentLevel)
    }, [currentLevel, loadLevel])

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined
        if (timerMode && timeLeft > 0 && !isGameOver) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
        } else if (timerMode && timeLeft === 0) {
            setIsGameOver(true)
            setFeedback('时间到！游戏结束。')
        }
        return () => clearTimeout(timer)
    }, [timerMode, timeLeft, isGameOver])

    const loadLevel = (levelIndex: number) => {
        const level = levels[levelIndex]
        const modules = predefinedModules.filter((module) => level.availableModules.includes(module.id))
        setAvailableModules(modules)
        setPrompts([])
        setFeedback('')
        setTimeLeft(difficulty === 'hard' ? 30 : 60)
        setIsGameOver(false)
        setShowTutorial(true)
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const newAvailableModules = Array.from(availableModules)
        const newPrompt = Array.from(prompts)

        if (result.source.droppableId === 'modules' && result.destination.droppableId === 'prompt') {
            const [movedItem] = newAvailableModules.splice(result.source.index, 1)
            newPrompt.splice(result.destination.index, 0, movedItem)
        } else if (result.source.droppableId === 'prompt' && result.destination.droppableId === 'modules') {
            const [movedItem] = newPrompt.splice(result.source.index, 1)
            newAvailableModules.splice(result.destination.index, 0, movedItem)
        } else if (result.source.droppableId === 'prompt' && result.destination.droppableId === 'prompt') {
            const [reorderedItem] = newPrompt.splice(result.source.index, 1)
            newPrompt.splice(result.destination.index, 0, reorderedItem)
        }

        setAvailableModules(newAvailableModules)
        setPrompts(newPrompt)
    }

    const handleSubmit = () => {
        const currentLevelData = levels[currentLevel]
        const userPrompt = prompts.map((m) => m.content).join(' ')
        if (userPrompt === currentLevelData.targetPrompt) {
            const levelScore = calculateScore()
            setScore((prevScore) => prevScore + levelScore)
            setFeedback(`太棒了！你完成了这个关卡！获得 ${levelScore} 分。`)
            checkAchievements(levelScore)
            if (currentLevel < levels.length - 1) {
                setTimeout(() => {
                    setCurrentLevel((prevLevel) => prevLevel + 1)
                }, 2000)
            } else {
                setFeedback('恭喜你完成了所有关卡！')
                checkAchievements(currentLevel)
            }
        } else {
            setFeedback('再试一次！提示：检查模块的顺序和是否使用了所有必要的模块。')
        }
    }

    const calculateScore = () => {
        const baseScore = 100
        const timeBonus = timerMode ? Math.max(0, timeLeft) : 0
        const difficultyMultiplier = difficulty === 'hard' ? 1.5 : 1
        return Math.round((baseScore + timeBonus) * difficultyMultiplier)
    }

    const checkAchievements = (levelScore: number) => {
        const newAchievements = [...unlockedAchievements]

        if (!newAchievements.includes('first_level')) {
            newAchievements.push('first_level')
        }

        if (currentLevel === levels.length - 1) {
            newAchievements.push('all_levels')
        }

        if (timerMode && timeLeft > 30) {
            newAchievements.push('speed_demon')
        }

        if (levelScore === 100) {
            const perfectScores = newAchievements.filter((a) => a === 'perfectionist').length
            if (perfectScores === 2) {
                newAchievements.push('perfectionist')
            }
        }

        setUnlockedAchievements([...new Set(newAchievements)])
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Prompt Engineering 游戏</h1>
            <Tabs defaultValue="game" className="w-full">
                <TabsList>
                    <TabsTrigger value="game">游戏</TabsTrigger>
                    <TabsTrigger value="achievements">成就</TabsTrigger>
                </TabsList>
                <TabsContent value="game">
                    <Card>
                        <CardHeader>
                            <CardTitle>{levels[currentLevel].name}</CardTitle>
                            <CardDescription>{levels[currentLevel].description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <Badge variant="outline" className="mr-2">
                                        难度: {difficulty}
                                    </Badge>
                                    <Badge variant="outline">得分: {score}</Badge>
                                </div>
                                {timerMode && (
                                    <div className="flex items-center">
                                        <Clock className="mr-2" />
                                        <span>{timeLeft}s</span>
                                    </div>
                                )}
                            </div>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <div className="flex flex-1">
                                    {/* 左侧模块库 */}
                                    <div className="w-1/4 bg-white p-4 rounded shadow mr-4">
                                        <h2 className="text-xl font-bold mb-4">模块库</h2>
                                        <Droppable droppableId="modules">
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="space-y-2"
                                                >
                                                    {availableModules.map((module, index) => (
                                                        <Draggable
                                                            key={module.id}
                                                            draggableId={module.id}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`p-2 rounded ${moduleTypes[module.type].color}`}
                                                                >
                                                                    {module.content}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>

                                    {/* 中间拼搭区 */}
                                    <div className="flex-1 bg-white p-4 rounded shadow mr-4">
                                        <h2 className="text-xl font-bold mb-4">拼搭区</h2>
                                        <Droppable droppableId="prompt">
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="min-h-[200px] border-2 border-dashed border-gray-300 p-4 flex flex-wrap items-start content-start"
                                                >
                                                    {prompts.map((module, index) => (
                                                        <Draggable
                                                            key={module.id}
                                                            draggableId={module.id}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`p-2 m-1 rounded ${moduleTypes[module.type].color}`}
                                                                >
                                                                    {module.content}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>

                                    {/* 右侧预览区 */}
                                    <div className="w-1/4 bg-white p-4 rounded shadow">
                                        <h2 className="text-xl font-bold mb-4">预览</h2>
                                        <div className="mb-4 p-2 bg-gray-100 rounded min-h-[100px]">
                                            {prompts.map((m) => m.content).join(' ')}
                                        </div>
                                        <Button onClick={handleSubmit} className="w-full" disabled={isGameOver}>
                                            提交
                                        </Button>
                                        {feedback && <div className="mt-4 p-2 bg-yellow-100 rounded">{feedback}</div>}
                                    </div>
                                </div>
                            </DragDropContext>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div>
                                <Button
                                    onClick={() => setDifficulty('normal')}
                                    variant={difficulty === 'normal' ? 'default' : 'outline'}
                                    className="mr-2"
                                >
                                    普通模式
                                </Button>
                                <Button
                                    onClick={() => setDifficulty('hard')}
                                    variant={difficulty === 'hard' ? 'default' : 'outline'}
                                >
                                    困难模式
                                </Button>
                            </div>
                            <Button
                                onClick={() => setTimerMode(!timerMode)}
                                variant={timerMode ? 'default' : 'outline'}
                            >
                                {timerMode ? '关闭计时' : '开启计时'}
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <HelpCircle className="mr-2 h-4 w-4" /> 教程
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>关卡教程</DialogTitle>
                                        <DialogDescription>{levels[currentLevel].tutorial}</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="achievements">
                    <Card>
                        <CardHeader>
                            <CardTitle>成就</CardTitle>
                            <CardDescription>你的游戏成就</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {achievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className={`p-4 border rounded ${unlockedAchievements.includes(achievement.id) ? 'bg-green-100' : 'bg-gray-100'}`}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-2">{achievement.icon}</span>
                                            <div>
                                                <h3 className="font-bold">{achievement.name}</h3>
                                                <p className="text-sm text-gray-600">{achievement.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
