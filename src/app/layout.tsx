import { Cormorant_Garamond, JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AppChrome } from '@/components/AppChrome'
import { I18nProvider } from '@/components/I18nProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-sans',
})
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' })
const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    style: ['normal', 'italic'],
    variable: '--font-serif',
})
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
            <body
                className={`${plusJakarta.variable} ${outfit.variable} ${cormorant.variable} ${jetBrainsMono.variable} antialiased min-w-[320px]`}
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
                        </TooltipProvider>
                    </ThemeProvider>
                </I18nProvider>
            </body>
        </html>
    )
}
