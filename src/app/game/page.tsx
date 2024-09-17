'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from 'framer-motion'
import { Book, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

// Game data (this would typically come from a backend API)
const levels = [
    { id: 1, name: "Prompt 入门", description: "学习基础的 Prompt 编写技巧", unlocked: true },
    { id: 2, name: "总结技能", description: "学习如何准确地总结长篇文章或数据", unlocked: false },
    { id: 3, name: "推理任务", description: "学习如何从信息中推理出隐藏的内容", unlocked: false },
    { id: 4, name: "转换技巧", description: "学习如何将原始数据转换成不同的语言或格式", unlocked: false },
    { id: 5, name: "扩展任务", description: "学习如何通过 Prompt 生成更复杂的内容或任务", unlocked: false },
]

const skills = [
    { id: 1, name: "基础总结", description: "快速从长文本中提取关键信息", level: 1 },
    { id: 2, name: "高级推理", description: "从复杂的上下文中推断出隐藏信息", level: 0 },
    { id: 3, name: "多语言支持", description: "将 Prompt 转换为不同语言的能力", level: 0 },
]

const achievements = [
    { id: 1, name: "新手提示工程师", description: "完成第一个任务", unlocked: true },
    { id: 2, name: "总结大师", description: "成功完成三次总结任务", unlocked: false },
    { id: 3, name: "推理专家", description: "在推理任务中获得满分", unlocked: false },
]

const leaderboard = [
    { rank: 1, name: "Alice", score: 1500, avatar: "/logo.jpeg?height=32&width=32" },
    { rank: 2, name: "Bob", score: 1400, avatar: "/logo.jpeg?height=32&width=32" },
    { rank: 3, name: "Charlie", score: 1300, avatar: "/logo.jpeg?height=32&width=32" },
    { rank: 4, name: "David", score: 1200, avatar: "/logo.jpeg?height=32&width=32" },
    { rank: 5, name: "Eve", score: 1100, avatar: "/logo.jpeg?height=32&width=32" },
]

export default function PromptEngineeringGame() {
    const [gameState, setGameState] = useState('mainMenu')
    const [playerLevel, setPlayerLevel] = useState(1)
    const [playerExp, setPlayerExp] = useState(0)
    const [playerName, setPlayerName] = useState("Player")
    const [playerAvatar, setPlayerAvatar] = useState("/logo.jpeg?height=64&width=64")

    useEffect(() => {
        // Load player data from local storage or API
        const savedPlayerName = localStorage.getItem('playerName')
        if (savedPlayerName) {
            setPlayerName(savedPlayerName)
        }
    }, [])

    const startGame = () => {
        setGameState('worldMap')
        toast({
            title: "欢迎来到 Prompt Engineering 冒险！",
            description: "你的任务是成为最强大的提示工程师，拯救这个虚拟世界。",
        })
    }

    const renderMainMenu = () => (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Prompt Engineering 冒险</CardTitle>
                <CardDescription className="text-center">成为最强大的提示工程师，拯救虚拟世界！</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={playerAvatar} alt={playerName} />
                    <AvatarFallback>{playerName[0]}</AvatarFallback>
                </Avatar>
                <Button onClick={startGame} className="w-full">
                    <Play className="mr-2 h-4 w-4" /> 开始冒险
                </Button>
                <Button variant="outline" className="w-full">设置</Button>
            </CardContent>
        </Card>
    )

    const renderWorldMap = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>世界地图</span>
                        <Badge variant="secondary">{playerName} - 等级 {playerLevel}</Badge>
                    </CardTitle>
                    <CardDescription>选择一个关卡开始你的冒险</CardDescription>
                </CardHeader>
                <CardContent>
                    <Progress value={(playerExp / 1000) * 100} className="mb-2" />
                    <p className="text-sm text-gray-500 mb-4">经验值: {playerExp} / 1000</p>
                    <div className="grid gap-4">
                        {levels.map((level) => (
                            <Button
                                key={level.id}
                                variant={level.unlocked ? "default" : "secondary"}
                                className="w-full justify-start"
                                disabled={!level.unlocked}
                                onClick={() => toast({
                                    title: `开始 ${level.name}`,
                                    description: "正在加载关卡...",
                                })}
                            >
                                <Book className="mr-2 h-4 w-4" />
                                {level.name}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="skills">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="skills">技能树</TabsTrigger>
                    <TabsTrigger value="achievements">成就</TabsTrigger>
                    <TabsTrigger value="leaderboard">排行榜</TabsTrigger>
                </TabsList>
                <TabsContent value="skills">
                    <Card>
                        <CardHeader>
                            <CardTitle>技能树</CardTitle>
                            <CardDescription>提升你的 Prompt Engineering 技能</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[200px]">
                                {skills.map((skill) => (
                                    <div key={skill.id} className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-medium">{skill.name}</p>
                                            <p className="text-sm text-gray-500">{skill.description}</p>
                                        </div>
                                        <Badge variant="secondary">等级 {skill.level}</Badge>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="achievements">
                    <Card>
                        <CardHeader>
                            <CardTitle>成就</CardTitle>
                            <CardDescription>展示你的 Prompt Engineering 成就</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[200px]">
                                {achievements.map((achievement) => (
                                    <div key={achievement.id} className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-medium">{achievement.name}</p>
                                            <p className="text-sm text-gray-500">{achievement.description}</p>
                                        </div>
                                        {achievement.unlocked ? (
                                            <Badge variant="default">已解锁</Badge>
                                        ) : (
                                            <Badge variant="secondary">未解锁</Badge>
                                        )}
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="leaderboard">
                    <Card>
                        <CardHeader>
                            <CardTitle>排行榜</CardTitle>
                            <CardDescription>查看全球最强 Prompt 工程师</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[200px]">
                                {leaderboard.map((player) => (
                                    <div key={player.rank} className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <span className="font-bold mr-2">#{player.rank}</span>
                                            <Avatar className="w-8 h-8 mr-2">
                                                <AvatarImage src={player.avatar} alt={player.name} />
                                                <AvatarFallback>{player.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span>{player.name}</span>
                                        </div>
                                        <Badge variant="secondary">{player.score} 分</Badge>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={gameState}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {gameState === 'mainMenu' && renderMainMenu()}
                        {gameState === 'worldMap' && renderWorldMap()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
