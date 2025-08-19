import { Image, Keyboard, Languages, School } from 'lucide-react'

export type AppData = {
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
        name: 'AGI School',
        description: 'Learn about Artificial General Intelligence',
        color: '#8b5cf6',
        path: '/agi-school',
        icon: School,
    },
]
export default apps
