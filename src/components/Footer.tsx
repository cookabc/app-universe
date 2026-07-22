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
        <footer className="w-full mt-auto border-t border-border">
            <div className="container max-w-7xl mx-auto px-4 py-14 grid gap-10 sm:grid-cols-3">
                <div className="space-y-3">
                    <p className="serif-display text-xl text-foreground">{brand}</p>
                    <p className="index-label">{meta}</p>
                </div>
                <nav aria-label="Site" className="space-y-2">
                    <p className="index-label mb-3">Navigate</p>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                {home}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/privacy"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {privacy}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/terms"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {terms}
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="space-y-3">
                    <p className="index-label">Colophon</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        A hand-maintained index of tools that earn their place. Set in Fraunces & Inter.
                    </p>
                </div>
            </div>
            <div className="border-t border-border">
                <div className="container max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
                    <p className="index-label">
                        © {new Date().getFullYear()} {brand}
                    </p>
                    <p className="index-label hidden sm:inline">{tools.length} entries</p>
                </div>
            </div>
        </footer>
    )
}
