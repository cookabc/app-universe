import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AppChrome } from '@/components/AppChrome'
import { I18nProvider } from '@/components/I18nProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'
import '../wayseeker.css'
import '../wayseeker-chrome.css'
import '../wayseeker-themes.css'
import '../atlas.css'

const plexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-sans',
})
const plexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400', '500'],
    variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} — Find your next tool`,
        template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: {
        title: `${SITE_NAME} — Find your next tool`,
        description: SITE_DESCRIPTION,
        type: 'website',
        url: SITE_URL,
        siteName: SITE_NAME,
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} — Find your next tool`,
        description: SITE_DESCRIPTION,
    },
    alternates: {
        canonical: '/',
    },
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f9f9f8' },
        { media: '(prefers-color-scheme: dark)', color: '#18191b' },
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
        <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
            <body className={`${plexSans.variable} ${plexMono.variable} antialiased min-w-[320px]`}>
                <I18nProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        enableColorScheme
                        storageKey="wayseeker-theme"
                    >
                        <TooltipProvider delayDuration={300}>
                            {/* No bg here: the body's felt must show through on
                                detail and legal pages, which have no shell. */}
                            <div className="flex flex-col min-h-screen">
                                <AppChrome>{children}</AppChrome>
                            </div>
                        </TooltipProvider>
                    </ThemeProvider>
                </I18nProvider>
            </body>
        </html>
    )
}
