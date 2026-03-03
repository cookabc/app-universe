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

export const metadata = {
    title: 'App Universe',
    description: 'Discover and use amazing AI-powered tools',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

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
                {publishableKey ? (
                    <ClerkProvider telemetry={false} publishableKey={publishableKey}>
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
                ) : (
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
                )}
            </body>
        </html>
    )
}
