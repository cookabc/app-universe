'use client'

import Link from 'next/link'
import { useI18nReady } from '@/hooks/useI18nReady'

export const Footer = () => {
    const { t, isReady } = useI18nReady()
    const brand = isReady ? t('brand.name') : 'App Universe'
    const privacy = isReady ? t('nav.privacy') : 'Privacy'
    const terms = isReady ? t('nav.terms') : 'Terms'
    const home = isReady ? t('nav.home') : 'Home'

    return (
        <footer className="w-full mt-auto py-10 border-t border-border/60">
            <div className="container max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {brand}
                </p>
                <nav aria-label="Legal" className="flex items-center gap-6 text-sm text-muted-foreground">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                        {privacy}
                    </Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                        {terms}
                    </Link>
                    <Link href="/" className="hover:text-foreground transition-colors">
                        {home}
                    </Link>
                </nav>
            </div>
        </footer>
    )
}
