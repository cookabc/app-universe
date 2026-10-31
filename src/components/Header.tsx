'use client'

import Link from 'next/link'
import { ThemeSwitch } from '@/components/theme-switch'
import { useI18nReady } from '@/hooks/useI18nReady'
import { LanguageSwitcher } from './LanguageSwitcher'

/** Two-by-two drawer front, one drawer marked: the cabinet at favicon size. */
export function CabinetMark({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <rect x="1" y="1" width="22" height="22" rx="3" fill="var(--lacquer)" />
            <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1" fill="var(--paper-hi)" />
            <rect x="13" y="3.5" width="7.5" height="7.5" rx="1" fill="var(--paper-hi)" />
            <rect x="3.5" y="13" width="7.5" height="7.5" rx="1" fill="var(--paper-hi)" />
            <rect x="13" y="13" width="7.5" height="7.5" rx="1" fill="var(--seal)" />
        </svg>
    )
}

export const Header = () => {
    const { t } = useI18nReady()
    const brand = t('brand.name')

    return (
        <header className="site-header">
            <div className="wrap site-header-inner">
                <Link href="/" className="wordmark" aria-label={brand}>
                    <CabinetMark />
                    <span className="wordmark-name">{brand}</span>
                </Link>

                <nav className="site-nav" aria-label={t('nav.primary')}>
                    <Link href="/#cabinet" className="site-nav-link caps">
                        {t('nav.cabinet')}
                    </Link>
                    <Link href="/#prescription" className="site-nav-link caps">
                        {t('nav.prescription')}
                    </Link>
                    <LanguageSwitcher />
                    <ThemeSwitch />
                </nav>
            </div>
        </header>
    )
}
