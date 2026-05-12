export interface Category {
    key: string
    label: string
    color: string
    gradient: string
    icon: string
}
export const CATEGORIES: Category[] = [
    {
        key: 'diagram',
        label: 'Diagram',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        icon: 'diagram',
    },
    {
        key: 'design',
        label: 'Design',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg,#ec4899,#f97316)',
        icon: 'design',
    },
    {
        key: 'screenshot',
        label: 'Screenshot',
        color: '#f97316',
        gradient: 'linear-gradient(135deg,#f97316,#eab308)',
        icon: 'screenshot',
    },
    {
        key: 'course',
        label: 'Course',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)',
        icon: 'course',
    },
    {
        key: 'devtools',
        label: 'DevTools',
        color: '#10b981',
        gradient: 'linear-gradient(135deg,#10b981,#22c55e)',
        icon: 'devtools',
    },
    {
        key: 'security',
        label: 'Security',
        color: '#ef4444',
        gradient: 'linear-gradient(135deg,#ef4444,#f97316)',
        icon: 'security',
    },
    {
        key: 'workflow',
        label: 'Workflow',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
        icon: 'workflow',
    },
    {
        key: 'macos',
        label: 'macOS',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)',
        icon: 'macos',
    },
    {
        key: 'web',
        label: 'Web',
        color: '#eab308',
        gradient: 'linear-gradient(135deg,#eab308,#f97316)',
        icon: 'web',
    },
    {
        key: 'business',
        label: 'Business',
        color: '#2f6f62',
        gradient: 'linear-gradient(135deg,#2f6f62,#9b762e)',
        icon: 'business',
    },
    {
        key: 'methodology',
        label: 'Methodology',
        color: '#5d6f8f',
        gradient: 'linear-gradient(135deg,#5d6f8f,#7660aa)',
        icon: 'methodology',
    },
    {
        key: 'document',
        label: 'Document',
        color: '#8b6f47',
        gradient: 'linear-gradient(135deg,#8b6f47,#9b762e)',
        icon: 'document',
    },
]
export const MAP: Record<string, string> = {
    'fireworks-tech-graph': 'diagram',
    blueprinter: 'diagram',
    'design-system': 'design',
    'ui-ux-pro-max': 'design',
    'ai-style-copycat': 'design',
    'editorial-card-screenshot': 'design',
    'app-store-screenshots': 'screenshot',
    'asc-screenshots': 'screenshot',
    'app-icon-minimalist': 'screenshot',
    'gpt-image-2': 'design',
    'codebase-to-course': 'course',
    'deep-domain-learning': 'course',
    ink: 'devtools',
    'git-author-replacement': 'devtools',
    'find-skills': 'devtools',
    'asc-cli-usage': 'devtools',
    'slowmist-agent-security': 'security',
    'follow-builders': 'workflow',
    'grill-me': 'workflow',
    'user-story-review': 'workflow',
    'macos-menubar-tuist-app': 'macos',
    'macos-design-guidelines': 'macos',
    'web-design-guidelines': 'web',
    'web-design-engineer': 'web',
}
export function getCategory(id: string) {
    const k = MAP[id] || 'devtools'
    return CATEGORIES.find((c) => c.key === k) || CATEGORIES[4]
}
