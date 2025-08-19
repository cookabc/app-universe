import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <ClerkProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <main className="flex-grow">{children}</main>
                            <Footer />
                        </div>
                        <Toaster />
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}
