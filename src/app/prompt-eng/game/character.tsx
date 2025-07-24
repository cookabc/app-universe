'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import type { PlayerData } from '../interfaces'

const avatars = [
    {
        id: 1,
        src: '/placeholder.svg?height=100&width=100&text=👩‍💻',
        alt: 'Female Coder',
    },
    {
        id: 2,
        src: '/placeholder.svg?height=100&width=100&text=👨‍💻',
        alt: 'Male Coder',
    },
    { id: 3, src: '/placeholder.svg?height=100&width=100&text=🤖', alt: 'Robot' },
    { id: 4, src: '/placeholder.svg?height=100&width=100&text=👽', alt: 'Alien' },
]

const backgrounds = [
    { id: 1, name: '计算机科学学生' },
    { id: 2, name: '软件工程师' },
    { id: 3, name: '数据科学家' },
    { id: 4, name: 'AI研究员' },
]

interface CharacterCustomizationProps {
    onComplete: (character: PlayerData) => void
}

export default function CharacterCustomization({ onComplete }: CharacterCustomizationProps) {
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState(avatars[0])
    const [background, setBackground] = useState(backgrounds[0] ? backgrounds[0].name : '')
    const [specialization, setSpecialization] = useState('自然语言处理')

    const handleSubmit = () => {
        if (!name) {
            toast({
                title: '请输入名字',
                description: '名字不能为空',
                variant: 'destructive',
            })
            return
        }

        onComplete({
            name,
            level: 1,
            exp: 0,
            avatar: avatar ? avatar.src : '',
        })

        toast({
            title: '角色创建成功！',
            description: '你的Prompt工程师之旅即将开始！',
        })
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>创建你的Prompt工程师</CardTitle>
                <CardDescription>自定义你的角色以开始冒险</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">名字</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="输入你的名字"
                    />
                </div>
                <div className="space-y-2">
                    <Label>选择头像</Label>
                    <div className="flex space-x-4">
                        {avatars.map((av) => (
                            <motion.div
                                key={av.id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setAvatar(av)}
                            >
                                <Avatar
                                    className={`w-16 h-16 cursor-pointer ${avatar && avatar.id === av.id ? 'ring-2 ring-primary' : ''}`}
                                >
                                    <AvatarImage src={av.src} alt={av.alt} />
                                    <AvatarFallback>{av.alt[0]}</AvatarFallback>
                                </Avatar>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="background">选择背景</Label>
                    <Select value={background} onValueChange={setBackground}>
                        <SelectTrigger id="backgroun">
                            <SelectValue placeholder="选择你的背景" />
                        </SelectTrigger>
                        <SelectContent>
                            {backgrounds.map((bg) => (
                                <SelectItem key={bg.id} value={bg.name}>
                                    {bg.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>选择专业方向</Label>
                    <RadioGroup value={specialization} onValueChange={setSpecialization}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="自然语言处理" id="nlp" />
                            <Label htmlFor="nlp">自然语言处理</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="计算机视觉" id="cv" />
                            <Label htmlFor="cv">计算机视觉</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="强化学习" id="rl" />
                            <Label htmlFor="rl">强化学习</Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                    创建角色
                </Button>
            </CardContent>
        </Card>
    )
}
