import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AppChrome } from '@/components/AppChrome'
import { I18nProvider } from '@/components/I18nProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
})
const fraunces = Fraunces({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    axes: ['opsz'],
    variable: '--font-serif',
})
const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} — Tools that actually work`,
        template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: {
        title: `${SITE_NAME} — Tools that actually work`,
        description: SITE_DESCRIPTION,
        type: 'website',
        url: SITE_URL,
        siteName: SITE_NAME,
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} — Tools that actually work`,
        description: SITE_DESCRIPTION,
    },
    alternates: {
        canonical: '/',
    },
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
        { media: '(prefers-color-scheme: dark)', color: '#0c0d10' },
    ],
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${fraunces.variable} ${jetBrainsMono.variable} antialiased min-w-[320px]`}
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
