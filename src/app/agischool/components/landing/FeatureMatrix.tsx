/**
 * [INPUT]: 依赖 lucide-react 图标、shadcn/ui Card/Badge 组件、StaggerContainer 动画组件
 * [OUTPUT]: 对外提供 FeatureMatrix 功能特性矩阵（带动画）
 * [POS]: landing/ 的核心展示组件，四大 AI 能力模块
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { BarChart3, Bot, Eye, Palette } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '../common/FadeIn'
import { Badge } from '../ui/badge'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'

export function FeatureMatrix() {
    const features = [
        {
            title: 'Generative Art',
            desc: 'Create stunning visuals from text prompts. Learn diffusion models.',
            tools: '15 Tools',
            icon: <Palette className="w-7 h-7" />,
            colorClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        },
        {
            title: 'Smart Chatbots',
            desc: 'Build your own AI assistant using LLMs. Understand prompt engineering.',
            tools: '8 Tools',
            icon: <Bot className="w-7 h-7" />,
            colorClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Computer Vision',
            desc: 'Teach computers to see. Face detection and object recognition projects.',
            tools: '12 Tools',
            icon: <Eye className="w-7 h-7" />,
            colorClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        },
        {
            title: 'Data Science',
            desc: 'Analyze trends like a pro. Turn raw data into actionable insights.',
            tools: '10 Tools',
            icon: <BarChart3 className="w-7 h-7" />,
            colorClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
        },
    ]

    return (
        <section className="w-full bg-background-light dark:bg-background-dark py-20 px-4 flex justify-center">
            <div className="max-w-[1200px] w-full flex flex-col gap-12">
                {/* Section Header */}
                <StaggerContainer>
                    <StaggerItem>
                        <div className="flex flex-col gap-4 max-w-[720px]">
                            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-text-main dark:text-white">
                                Master the AI Capability Matrix
                            </h2>
                            <p className="text-lg text-text-muted dark:text-gray-400">
                                Explore our comprehensive modules designed to take you from novice to expert. Build a
                                diverse portfolio of AI skills.
                            </p>
                        </div>
                    </StaggerItem>
                </StaggerContainer>

                {/* Features Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <StaggerItem key={index}>
                            <Card className="group hover:-translate-y-1 transition-all duration-300">
                                <CardHeader>
                                    <div
                                        className={`size-12 rounded-xl flex items-center justify-center ${feature.colorClass}`}
                                    >
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    <CardDescription>{feature.desc}</CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto">
                                    <Badge variant="secondary" className="text-xs font-bold">
                                        {feature.tools}
                                    </Badge>
                                    <span className="text-xs font-medium text-primary cursor-pointer group-hover:underline ml-auto">
                                        View Module
                                    </span>
                                </CardFooter>
                            </Card>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}
