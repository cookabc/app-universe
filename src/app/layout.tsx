import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { PerformanceMonitor } from '@/components/optimized/performance-monitor'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

// Enhanced metadata for Next.js 15
export const metadata: Metadata = {
    title: {
        default: 'App Universe',
        template: '%s | App Universe',
    },
    description: 'Build your digital world, one app at a time.',
    keywords: ['apps', 'tools', 'productivity', 'games', 'utilities'],
    authors: [{ name: 'App Universe Team' }],
    creator: 'App Universe',
    publisher: 'App Universe',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://app-universe.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'App Universe',
        description: 'Build your digital world, one app at a time.',
        url: 'https://app-universe.com',
        siteName: 'App Universe',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'App Universe',
        description: 'Build your digital world, one app at a time.',
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <Suspense
                    fallback={
                        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                        </div>
                    }
                >
                    {children}
                </Suspense>
                <Toaster />
                <PerformanceMonitor enableConsoleLogging={process.env.NODE_ENV === 'development'} />
            </body>
        </html>
    )
}
