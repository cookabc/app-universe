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
        <footer className="w-full mt-auto border-t-2 border-foreground">
            <div className="container max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div className="space-y-2">
                        <p className="serif-display text-2xl text-foreground">{brand}</p>
                        <p className="index-label">{meta}</p>
                    </div>
                    <nav aria-label="Site" className="flex items-center gap-5 text-sm">
                        <Link href="/" className="index-label hover:text-foreground transition-colors">
                            {home}
                        </Link>
                        <Link href="/privacy" className="index-label hover:text-foreground transition-colors">
                            {privacy}
                        </Link>
                        <Link href="/terms" className="index-label hover:text-foreground transition-colors">
                            {terms}
                        </Link>
                    </nav>
                </div>
                <div className="mt-10 pt-4 border-t border-border flex items-center justify-between">
                    <p className="index-label">
                        © {new Date().getFullYear()} {brand}
                    </p>
                    <p className="index-label hidden sm:inline">{tools.length} entries</p>
                </div>
            </div>
        </footer>
    )
}
