import type { Metadata, Viewport } from 'next'
import { Archivo, Fragment_Mono, Noto_Serif_SC } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AppChrome } from '@/components/AppChrome'
import { I18nProvider } from '@/components/I18nProvider'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const archivo = Archivo({
    subsets: ['latin'],
    axes: ['wdth'],
    variable: '--font-archivo',
    display: 'swap',
})
const serifSc = Noto_Serif_SC({
    subsets: ['latin'],
    weight: ['500', '700'],
    variable: '--font-serif-sc',
    display: 'swap',
    preload: false,
})
const fragment = Fragment_Mono({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-fragment',
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} — What are you settling for?`,
        template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: {
        title: `${SITE_NAME} — What are you settling for?`,
        description: SITE_DESCRIPTION,
        type: 'website',
        url: SITE_URL,
        siteName: SITE_NAME,
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} — What are you settling for?`,
        description: SITE_DESCRIPTION,
    },
    alternates: {
        canonical: '/',
    },
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#e8ebe3' },
        { media: '(prefers-color-scheme: dark)', color: '#0d1714' },
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
            <body className={`${archivo.variable} ${serifSc.variable} ${fragment.variable} antialiased min-w-[320px]`}>
                <I18nProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        enableColorScheme
                        storageKey="wayseeker-theme"
                    >
                        <div className="flex flex-col min-h-screen">
                            <AppChrome>{children}</AppChrome>
                        </div>
                    </ThemeProvider>
                </I18nProvider>
            </body>
        </html>
    )
}
