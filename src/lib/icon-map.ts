import {
    BarChart3,
    BookOpen,
    Brain,
    Briefcase,
    Code,
    ExternalLink,
    Film,
    Gamepad,
    LayoutGrid,
    Lightbulb,
    Palette,
    Pencil,
    Sparkles,
    TrendingUp,
    Wand,
    Zap,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<any>> = {
    BarChart3,
    BookOpen,
    Brain,
    Briefcase,
    Code,
    ExternalLink,
    Film,
    Gamepad,
    LayoutGrid,
    Lightbulb,
    Palette,
    Pencil,
    Sparkles,
    TrendingUp,
    Wand,
    Zap,
}

export function getIcon(name: string): React.ComponentType<any> {
    return iconMap[name] || ExternalLink
}
