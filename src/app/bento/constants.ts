// Theme constants
export const THEME = {
    colors: {
        primary: '#064e3b',
        secondary: '#8b5cf6',
        accent: '#bbf7d0',
        background: '#f0fdf4',
        border: '#19192c',
        white: '#ffffff',
    },
    borderRadius: {
        card: '15px',
        button: '9999px', // full
    },
} as const

// Navigation
export const NAV_ITEMS = [
    { label: 'Docs', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Sign In', href: '#' },
] as const

// Features data
export const FEATURES = [
    {
        title: 'Open-Source Serving Engine',
        description: 'Build Inference APIs, Job Queues, and Compound AI',
        bgColor: 'bg-[#fdfce9]',
        iconColor: '#B8860B',
    },
    {
        title: 'Performance',
        description: 'Optimize for speed and efficiency',
        bgColor: 'bg-[#fdf2f2]',
        iconColor: '#FF69B4',
    },
    {
        title: 'Auto-Scaling',
        description: 'Adapt to varying workloads seamlessly',
        bgColor: 'bg-[#f3f0ff]',
        iconColor: '#8A2BE2',
    },
    {
        title: 'Rapid Iteration',
        description: 'Accelerate development cycles',
        bgColor: 'bg-[#f0f9ff]',
        iconColor: '#1E90FF',
    },
] as const

// Community stats
export const COMMUNITY_STATS = {
    deployments: '1 million+',
    members: '5000+',
    contributors: '200+',
} as const

// Types
export interface NavItem {
    label: string
    href: string
}

export interface Feature {
    title: string
    description: string
    bgColor: string
    iconColor: string
}

// Type guards and utilities
export type ThemeColors = typeof THEME.colors
export type NavItems = typeof NAV_ITEMS
export type Features = typeof FEATURES
