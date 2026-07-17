'use client'

import Link from 'next/link'
import tools from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

const CURATED_UPDATED = 'July 2026'

export const Footer = () => {
    const { t, isReady } = useI18nReady()
    const brand = isReady ? t('brand.name') : 'App Universe'
    const privacy = isReady ? t('nav.privacy') : 'Privacy'
    const terms = isReady ? t('nav.terms') : 'Terms'
    const home = isReady ? t('nav.home') : 'Home'
    const meta = isReady
        ? t('toolsWall.curatedMeta', { count: tools.length, date: CURATED_UPDATED })
        : `${tools.length} tools · updated ${CURATED_UPDATED}`

    return (
        <footer className="w-full mt-auto py-10 border-t border-border/60">
            <div className="container max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left space-y-1">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {brand}
                    </p>
                    <p className="text-xs text-muted-foreground/80">{meta}</p>
                </div>
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
