import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'

interface HeaderProps {
    isMuted: boolean
    toggleMute: () => void
}

export function Header({ isMuted, toggleMute }: HeaderProps) {
    const navLinks = [
        { name: '主页', href: '/prompt-eng' },
        { name: '学习模块', href: '/prompt-eng/learning' },
        { name: '挑战任务', href: '/prompt-eng/challenges' },
        { name: '达成成就', href: '/prompt-eng/achievements' },
        { name: '学习总结', href: '/prompt-eng/summary' },
    ]

    return (
        <nav className="bg-card shadow-md relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-primary">Prompt训练营</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navLinks.map(({ name, href }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`border-transparent text-muted-foreground hover:border-border hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    {name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={isMuted ? '取消静音' : '静音'}>
                            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                        </Button>
                        <Avatar className="ml-4">
                            <AvatarImage src="/logo.jpeg" alt="用户头像" />
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </nav>
    )
}
