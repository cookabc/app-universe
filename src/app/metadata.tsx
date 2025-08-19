
import type { Metadata, Viewport } from 'next'

// Enhanced metadata for Next.js 15
export const metadata: Metadata = {
    title: {
        default: 'AI Universe',
        template: '%s | AI Universe',
    },
    description: 'Your All-in-One AI Development Platform.',
    keywords: ['AI', 'development', 'platform', 'prompt engineering', 'workbench'],
    authors: [{ name: 'AI Universe Team' }],
    creator: 'AI Universe',
    publisher: 'AI Universe',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://ai-universe.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'AI Universe',
        description: 'Your All-in-One AI Development Platform.',
        url: 'https://ai-universe.com',
        siteName: 'AI Universe',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Universe',
        description: 'Your All-in-One AI Development Platform.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

// Separate viewport export for Next.js 15
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
    ],
}
