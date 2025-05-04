export type AppData = {
    name: string
    description: string
    color: string
    path: string
}

const apps: AppData[] = [
    {
        name: 'Language Converter',
        description: 'Convert text between different languages',
        color: '#F7B731',
        path: '/lang-converter',
    },
    {
        name: 'Flappy Bird',
        description: 'A classic game of skill and reflexes',
        color: '#FF6B6B',
        path: '/flappy-bird',
    },
    {
        name: 'MBTI Test',
        description: 'Take the MBTI personality test',
        color: '#FF6B6B',
        path: '/mbti-test',
    },
    {
        name: 'Salary Calculator',
        description: 'Calculate your expected salary',
        color: '#45B7D1',
        path: '/salary-calculator',
    },
    {
        name: 'Seal Generator',
        description: 'Generate a random seal',
        color: '#45B7D1',
        path: '/seal-generator',
    },
    {
        name: 'Social Media',
        description: 'Connect with friends and share updates',
        color: '#4ECDC4',
        path: '/social-media',
    },
    {
        name: 'Tool Navigation',
        description: 'Navigate to your favorite tools',
        color: '#F7B731',
        path: '/tool-navigation',
    },
    {
        name: 'Contribution Graph',
        description: 'Visualize your contributions over time',
        color: '#F7B731',
        path: '/contribution-graph',
    },
    {
        name: 'AI Artifacts',
        description: 'Discover AI-generated artifacts',
        color: '#4B7BEC',
        path: '/ai-artifacts',
    },
    {
        name: 'Word Search',
        description: 'Find words in a grid',
        color: '#4B7BEC',
        path: '/word-search',
    },
    {
        name: 'Bento',
        description: 'Unified Inference Platform',
        color: '#064e3b',
        path: '/bento',
    },
    {
        name: 'Pace Calculator',
        description: 'Calculate running pace and splits',
        color: '#3B82F6',
        path: '/pace-calculator',
    },
    {
        name: 'Typing Practice',
        description: 'Typing Practice',
        color: '#3B82F6',
        path: '/typing-practice',
    },
    {
        name: 'Share Card',
        description: 'Share Card',
        color: '#3B82F6',
        path: '/share-card',
    },
    {
        name: 'Sharing Card',
        description: 'Sharing Card',
        color: '#3B82F6',
        path: '/sharing-card',
    },
    {
        name: 'Icon Grid',
        description: 'Icon Grid',
        color: '#3B82F6',
        path: '/buttons',
    },
    {
        name: 'AGI School',
        description: 'Learn about Artificial General Intelligence',
        color: '#8b5cf6',
        path: '/agi-school',
    },
    {
        name: 'Prompt Engineering',
        description: 'Learn about Prompt Engineering',
        color: '#fb7bec',
        path: '/prompt-eng',
    },
]
export default apps
