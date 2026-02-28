import { Calendar, GraduationCap, Image, Keyboard, Languages, School, TrendingUp } from 'lucide-react'

type AppData = {
    name: string
    description: string
    color: string
    path: string
    icon: React.ComponentType<any>
}

const apps: AppData[] = [
    {
        name: 'Image Generator',
        description: 'Create stunning images from text prompts',
        color: '#c83b82',
        path: '/image-generator',
        icon: Image,
    },
    {
        name: 'Language Converter',
        description: 'Convert text between different languages',
        color: '#F7B731',
        path: '/lang-converter',
        icon: Languages,
    },
    {
        name: 'Typing Practice',
        description: 'Typing Practice',
        color: '#3B82F6',
        path: '/typing-practice',
        icon: Keyboard,
    },

    {
        name: 'DueKeep',
        description: 'Event countdown and calendar management',
        color: '#10b981',
        path: '/duekeep',
        icon: Calendar,
    },
    {
        name: 'AGI School',
        description: 'Complete education platform with courses',
        color: '#f97316',
        path: '/agischool',
        icon: GraduationCap,
    },
    {
        name: 'Real-time Fund',
        description: 'Track and manage your fund portfolio',
        color: '#ef4444',
        path: '/realtime-fund',
        icon: TrendingUp,
    },
]
export default apps
