'use client'

import { motion } from 'framer-motion'
import { Award, BookOpen, Brain, Code, Lightbulb, Target } from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const modules = [
    { name: '基础知识', progress: 100, score: 95 },
    { name: '提示工程', progress: 80, score: 85 },
    { name: '创意写作', progress: 60, score: 75 },
    { name: '代码生成', progress: 40, score: 70 },
    { name: '数据分析', progress: 20, score: 65 },
]

const badges = [
    {
        name: '学习达人',
        icon: <BookOpen className="h-4 w-4" />,
        description: '完成所有基础模块',
    },
    {
        name: '创意之星',
        icon: <Lightbulb className="h-4 w-4" />,
        description: '在创意写作中获得高分',
    },
    {
        name: '代码大师',
        icon: <Code className="h-4 w-4" />,
        description: '成功生成10个复杂函数',
    },
    {
        name: '分析专家',
        icon: <Brain className="h-4 w-4" />,
        description: '在数据分析挑战中表现出色',
    },
]

const challenges = [
    {
        name: '优化复杂提示',
        difficulty: '困难',
        reward: 50,
        icon: <Target className="h-4 w-4" />,
    },
    {
        name: '创作科幻短篇',
        difficulty: '中等',
        reward: 30,
        icon: <BookOpen className="h-4 w-4" />,
    },
    {
        name: '生成高效算法',
        difficulty: '困难',
        reward: 60,
        icon: <Code className="h-4 w-4" />,
    },
    {
        name: '分析大数据集',
        difficulty: '中等',
        reward: 40,
        icon: <Brain className="h-4 w-4" />,
    },
]

export default function SummaryPage() {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-center mb-8">学习总结</h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>总进度</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center">
                                <div className="relative w-32 h-32">
                                    <svg
                                        className="w-full h-full"
                                        viewBox="0 0 36 36"
                                        aria-labelledby="progress-circle-title"
                                    >
                                        <title id="progress-circle-title">Progress Circle</title>
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#E5E7EB"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#4F46E5"
                                            strokeWidth="2"
                                            strokeDasharray="60, 100"
                                        />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                                        60%
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>总分数</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-center">850</div>
                            <p className="text-center text-sm text-gray-500 mt-2">排名前 20%</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>已获得勋章</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center space-x-2">
                                {badges.slice(0, 3).map((badge, index) => (
                                    <Badge key={badge.name} variant="secondary" className="text-xs">
                                        {badge.icon}
                                        <span className="ml-1">{badge.name}</span>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">学习概览</TabsTrigger>
                        <TabsTrigger value="challenges">个性化挑战</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <Card>
                            <CardHeader>
                                <CardTitle>模块进度</CardTitle>
                                <CardDescription>查看每个学习模块的完成情况</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={modules}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                            <Tooltip />
                                            <Legend />
                                            <Bar yAxisId="left" dataKey="progress" fill="#8884d8" name="进度 (%)" />
                                            <Bar yAxisId="right" dataKey="score" fill="#82ca9d" name="得分" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 space-y-4">
                                    {modules.map((module, index) => (
                                        <div key={module.name}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium">{module.name}</span>
                                                <span className="text-sm font-medium">{module.progress}%</span>
                                            </div>
                                            <Progress value={module.progress} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="challenges">
                        <Card>
                            <CardHeader>
                                <CardTitle>个性化挑战</CardTitle>
                                <CardDescription>基于你的学习进度，我们为你准备了以下挑战</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px] w-full">
                                    {challenges.map((challenge, index) => (
                                        <div
                                            key={challenge.name}
                                            className="flex items-center justify-between p-4 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                        >
                                            <div className="flex items-center">
                                                <div className="mr-4 p-2 bg-blue-100 rounded-full">
                                                    {challenge.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{challenge.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        难���: {challenge.difficulty}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <Badge variant="secondary">
                                                    <Award className="h-4 w-4 mr-1" />
                                                    {challenge.reward} 积分
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Card>
                    <CardHeader>
                        <CardTitle>学习建议</CardTitle>
                        <CardDescription>基于你的学习情况，我们为你提供以下建议</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="mr-4 p-2 bg-green-100 rounded-full">
                                    <Lightbulb className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium">继续挑战创意写作</h3>
                                    <p className="text-sm text-gray-500">
                                        你在创意写作模块表现出色，建议尝试更高难度的任务。
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="mr-4 p-2 bg-yellow-100 rounded-full">
                                    <Brain className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium">加强数据分析能力</h3>
                                    <p className="text-sm text-gray-500">
                                        数据分析模块的完成度较低，建议多加练习，提高分析能力。
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="mr-4 p-2 bg-blue-100 rounded-full">
                                    <Target className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium">尝试跨模块整合任务</h3>
                                    <p className="text-sm text-gray-500">
                                        你已经掌握了多个模块的基础知识，可以尝试结合多个领域的综合性任务。
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
