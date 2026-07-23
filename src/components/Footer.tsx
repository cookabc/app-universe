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
    const colophon = isReady ? t('footer.colophon') : 'Archive colophon'
    const meta = isReady
        ? t('toolsWall.curatedMeta', { count: tools.length, date: CURATED_UPDATED })
        : `${tools.length} tools · updated ${CURATED_UPDATED}`

    return (
        <footer className="mt-auto w-full border-t-2 border-foreground bg-card">
            <div className="container max-w-7xl mx-auto px-4 py-10 sm:py-12">
                <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                        <p className="index-label index-label--accent mb-3">{colophon}</p>
                        <p className="display-heading text-2xl text-foreground">{brand}</p>
                        <p className="index-label mt-2">{meta}</p>
                    </div>
                    <nav aria-label="Site" className="flex items-center gap-5 text-sm">
                        <Link
                            href="/"
                            className="index-label inline-flex min-h-11 items-center border-b-2 border-transparent hover:border-foreground hover:text-foreground transition-colors"
                        >
                            {home}
                        </Link>
                        <Link
                            href="/privacy"
                            className="index-label inline-flex min-h-11 items-center border-b-2 border-transparent hover:border-foreground hover:text-foreground transition-colors"
                        >
                            {privacy}
                        </Link>
                        <Link
                            href="/terms"
                            className="index-label inline-flex min-h-11 items-center border-b-2 border-transparent hover:border-foreground hover:text-foreground transition-colors"
                        >
                            {terms}
                        </Link>
                    </nav>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
                    <p className="index-label">
                        © {new Date().getFullYear()} {brand}
                    </p>
                    <p className="index-label hidden sm:inline">{tools.length} entries</p>
                </div>
            </div>
        </footer>
    )
}
