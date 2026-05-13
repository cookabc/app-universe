import { BarChart3, Sparkles, TrendingUp } from 'lucide-react'

type AppData = {
    name: {
        en: string
        zh: string
    }
    description: {
        en: string
        zh: string
    }
    color: string
    path: string
    icon: React.ComponentType<any>
}

const apps: AppData[] = [
    {
        name: {
            en: 'Real-time Fund',
            zh: '实时基金',
        },
        description: {
            en: 'Track and manage your fund portfolio',
            zh: '跟踪和管理您的基金投资组合',
        },
        color: '#ef4444',
        path: '/realtime-fund',
        icon: TrendingUp,
    },
    {
        name: {
            en: 'Stock Platform',
            zh: '股票平台',
        },
        description: {
            en: 'Professional stock analysis and trading platform',
            zh: '专业的股票分析与交易平台',
        },
        color: '#3b82f6',
        path: '/stock',
        icon: BarChart3,
    },
    {
        name: {
            en: 'Skill Showcase',
            zh: '技能展示',
        },
        description: {
            en: 'Explore and discover AI agent skills',
            zh: '探索和发现 AI 智能体技能',
        },
        color: '#d4a853',
        path: '/skill-showcase',
        icon: Sparkles,
    },
]
export default apps
