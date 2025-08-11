'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { languages } from '../constants'

const AppIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>Language Converter Icon</title>
        <rect width="40" height="40" rx="8" fill="#3B82F6" />
        <path
            d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20Z"
            fill="white"
        />
        <path d="M15 18H25M15 22H25" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 13V27" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 15L23 25" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <path d="M23 15L17 25" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

interface HeaderProps {
    uiLanguage: 'en' | 'ja' | 'zh'
    setUiLanguage: (value: 'en' | 'ja' | 'zh') => void
}

export function Header({ uiLanguage, setUiLanguage }: HeaderProps) {
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
                <AppIcon />
                <h1 className="text-4xl font-bold font-bangers">{languages[uiLanguage].title}</h1>
            </div>
            <div className="flex items-center space-x-2">
                <Select value={uiLanguage} onValueChange={setUiLanguage}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                >
                    {theme === 'dark' ? (
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                    )}
                </Button>
            </div>
        </div>
    )
}
