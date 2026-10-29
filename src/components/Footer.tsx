'use client'

import Link from 'next/link'
import tools from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

export const Footer = () => {
    const { t, isReady } = useI18nReady()
    const brand = isReady ? t('brand.name') : 'Wayseeker'
    const privacy = isReady ? t('nav.privacy') : 'Privacy'
    const terms = isReady ? t('nav.terms') : 'Terms'
    const home = isReady ? t('nav.home') : 'Home'
    const meta = isReady ? t('toolsWall.curatedMeta', { count: tools.length }) : `${tools.length} tools, human-curated`

    return (
        <footer className="wayfinder-footer mt-auto w-full">
            <div className="container max-w-7xl mx-auto px-4 py-10 sm:py-12">
                <div className="wayfinder-footer-main">
                    <div>
                        <p className="wayfinder-brand-name">{brand}</p>
                        <p className="wayfinder-footer-meta">{meta}</p>
                    </div>
                    <nav aria-label="Site" className="wayfinder-footer-links">
                        <Link href="/">{home}</Link>
                        <Link href="/privacy">{privacy}</Link>
                        <Link href="/terms">{terms}</Link>
                    </nav>
                </div>
                <p className="wayfinder-footer-meta wayfinder-footer-bottom">
                    © {new Date().getFullYear()} {brand}
                </p>
            </div>
        </footer>
    )
}
