import { ThemeProvider } from 'next-themes'
import { AppChrome } from '@/components/AppChrome'
import { I18nProvider } from '@/components/I18nProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { fontVariableClassName } from '@/lib/fonts'
import { LOCALE_MIGRATION_SCRIPT, type Locale } from '@/lib/locale'
import { getMessages } from '@/lib/messages'

/**
 * The document shell shared by locale pages and the global 404.
 * `lang` is set here so the first byte of HTML is already in that language.
 */
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
    const { nav } = getMessages(locale)

    return (
        <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
            <body className={fontVariableClassName}>
                {/* One-time bridge: visitors who saved a language before it had a URL. */}
                <script
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: static migration script, no user input
                    dangerouslySetInnerHTML={{ __html: LOCALE_MIGRATION_SCRIPT }}
                />
                <a href="#main-content" className="skip-link">
                    {nav.skipToContent}
                </a>
                <div className="grain" aria-hidden="true" />
                <I18nProvider key={locale} locale={locale}>
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
