'use client'

import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Camera, ChevronLeft, ChevronRight, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { toast } from '@/hooks/use-toast'

interface Achievement {
    id: number
    name: string
    description: string
    icon: string
    unlocked: boolean
}

const achievements: Achievement[] = [
    {
        id: 1,
        name: '初级提示工程师',
        description: '完成1个模块学习',
        icon: '🎓',
        unlocked: true,
    },
    {
        id: 2,
        name: '总结大师',
        description: '在总结模块中达到高分',
        icon: '📊',
        unlocked: true,
    },
    {
        id: 3,
        name: '创意之星',
        description: '在创意写作模块中获得满分',
        icon: '✨',
        unlocked: false,
    },
    {
        id: 4,
        name: '代码解析专家',
        description: '成功优化5段复杂代码',
        icon: '💻',
        unlocked: false,
    },
    {
        id: 5,
        name: '高级提示工程师',
        description: '完成所有模块并获得优秀成绩',
        icon: '🏆',
        unlocked: false,
    },
]

const avatarItems = [
    { id: 1, name: '默认头像', src: '/logo.jpeg?height=100&width=100' },
    {
        id: 2,
        name: '毕业帽',
        src: '/logo.jpeg?height=100&width=100&text=🎓',
    },
    { id: 3, name: '奖杯', src: '/logo.jpeg?height=100&width=100&text=🏆' },
    {
        id: 4,
        name: '机器人',
        src: '/logo.jpeg?height=100&width=100&text=🤖',
    },
]

export default function AchievementPage() {
    const [unlockedAchievements, setUnlockedAchievements] = useState(achievements.filter((a) => a.unlocked))
    const [progress, _setProgress] = useState(40)
    const [selectedAvatar, setSelectedAvatar] = useState(avatarItems[0])
    const [showUnlockAnimation, setShowUnlockAnimation] = useState(false)
    const [_currentAvatarIndex, setCurrentAvatarIndex] = useState(0)

    const handleUnlockAchievement = (achievement: Achievement) => {
        if (!achievement.unlocked) {
            setUnlockedAchievements([...unlockedAchievements, achievement])
            setShowUnlockAnimation(true)
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
            setTimeout(() => setShowUnlockAnimation(false), 3000)
        }
    }

    const handleShare = () => {
        const shareText = `我在Prompt工程师训练营中解锁了${unlockedAchievements.length}个成就！来挑战我吧！`
        if (navigator.share) {
            navigator.share({
                title: 'Prompt工程师训练营成就',
                text: shareText,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                toast({
                    title: '分享文本已复制',
                    description: '你可以将它粘贴到社交媒体上分享。',
                })
            })
        }
    }

    const handleAvatarChange = (direction: number) => {
        setCurrentAvatarIndex((prevIndex) => {
            let newIndex = prevIndex + direction
            if (newIndex < 0) newIndex = avatarItems.length - 1
            if (newIndex >= avatarItems.length) newIndex = 0
            setSelectedAvatar(avatarItems[newIndex])
            return newIndex
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
                    <h1 className="text-3xl font-bold text-center mb-8">成就与勋章</h1>
                </motion.div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>你的进度</CardTitle>
                        <CardDescription>
                            还差 {5 - unlockedAchievements.length} 个成就即可解锁"高级提示工程师"
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={progress} className="mb-4" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">当前等级: 初级提示工程师</span>
                            <span className="text-sm font-medium">下一等级: 中级提示工程师</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>你的头像</CardTitle>
                        <CardDescription>根据你的成就自定义头像</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center mb-4">
                            <Button variant="outline" onClick={() => handleAvatarChange(-1)}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Avatar className="h-24 w-24 mx-4">
                                <AvatarImage src={selectedAvatar?.src ?? ''} alt={selectedAvatar?.name ?? ''} />
                                <AvatarFallback>{selectedAvatar?.name ? selectedAvatar.name[0] : '?'}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" onClick={() => handleAvatarChange(1)}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-center font-medium">{selectedAvatar?.name ?? '未选择头像'}</p>
                    </CardContent>
                </Card>

                <div className="grid gap-4 mb-8">
                    {achievements.map((achievement) => (
                        <Card key={achievement.id} className={achievement.unlocked ? 'border-green-500' : ''}>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="text-2xl mr-2">{achievement.icon}</span>
                                    {achievement.name}
                                </CardTitle>
                                <CardDescription>{achievement.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {achievement.unlocked ? (
                                    <Button variant="outline" className="w-full" disabled>
                                        已解锁
                                    </Button>
                                ) : (
                                    <Button className="w-full" onClick={() => handleUnlockAchievement(achievement)}>
                                        解锁成就
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-between">
                    <Button variant="outline" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        分享成就
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Camera className="mr-2 h-4 w-4" />
                                查看所有可用头像
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>可用头像</DialogTitle>
                                <DialogDescription>解锁更多成就以获得新的头像选项！</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                                {avatarItems.map((item) => (
                                    <div key={item.id} className="text-center">
                                        <Avatar className="h-16 w-16 mx-auto mb-2">
                                            <AvatarImage src={item.src} alt={item.name} />
                                            <AvatarFallback>{item.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm font-medium">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <AnimatePresence>
                    {showUnlockAnimation && (
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
                                        新成就解锁！
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-center text-2xl mb-4">🎉</p>
                                    <p className="text-center">恭喜你解锁了新的成就！</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
