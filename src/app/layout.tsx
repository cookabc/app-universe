import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-serif' })
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        template: '%s | App Universe',
        default: 'App Universe | AI-powered Tools Collection',
    },
    description: 'Discover and use amazing AI-powered tools including language converters, image generators, real-time fund trackers, and more.',
    keywords: ['AI tools', 'Next.js', 'React', 'language converter', 'image generator', 'typing practice', 'real-time fund'],
    authors: [{ name: 'App Universe Team' }],
    creator: 'App Universe Team',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://app-universe.example.com',
        title: 'App Universe | AI-powered Tools Collection',
        description: 'Discover and use amazing AI-powered tools including language converters, image generators, real-time fund trackers, and more.',
        siteName: 'App Universe',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'App Universe | AI-powered Tools Collection',
        description: 'Discover and use amazing AI-powered tools including language converters, image generators, real-time fund trackers, and more.',
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={`${plusJakarta.variable} ${outfit.variable} ${jetBrainsMono.variable} antialiased min-w-[320px]`}>
                <ClerkProvider telemetry={false}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <TooltipProvider delayDuration={300}>
                            <div className="flex flex-col min-h-screen bg-background">
                                <Header />
                                <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">{children}</main>
                                <Footer />
                            </div>
                            <Toaster />
                        </TooltipProvider>
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}
