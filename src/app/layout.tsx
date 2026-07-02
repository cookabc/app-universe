import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AppChrome } from '@/components/AppChrome'
import { I18nProvider } from '@/components/I18nProvider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-sans',
})
const outfit = Outfit({ subsets: ['latin'], variable: '--font-serif' })
const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
})

export const metadata = {
    title: 'App Universe — Tools that actually work',
    description: 'A curated collection of apps and tools for design, finance, productivity, and more.',
    openGraph: {
        title: 'App Universe — Tools that actually work',
        description: 'A curated collection of apps and tools for design, finance, productivity, and more.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'App Universe — Tools that actually work',
        description: 'A curated collection of apps and tools for design, finance, productivity, and more.',
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
            <body
                className={`${plusJakarta.variable} ${outfit.variable} ${jetBrainsMono.variable} antialiased min-w-[320px]`}
            >
                <a href="#main-content" className="skip-link">
                    Skip to content
                </a>
                <div className="grain" aria-hidden="true" />
                <I18nProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        enableColorScheme
                        storageKey="app-universe-theme"
                    >
                        <TooltipProvider delayDuration={300}>
                            <div className="flex flex-col min-h-screen bg-background">
                                <AppChrome>{children}</AppChrome>
                            </div>
                            <Toaster />
                        </TooltipProvider>
                    </ThemeProvider>
                </I18nProvider>
            </body>
        </html>
    )
}
