'use client'

import Link from 'next/link'
import { ThemeSwitch } from '@/components/theme-switch'
import { useI18nReady } from '@/hooks/useI18nReady'
import { LanguageSwitcher } from './LanguageSwitcher'

export const Header = () => {
    const { t, isReady } = useI18nReady()
    const brand = isReady ? t('brand.name') : 'Wayseeker'

    return (
        <header className="wayfinder-header sticky top-0 z-[var(--z-header)] w-full">
            <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="wayfinder-wordmark group flex min-h-11 items-center gap-2.5" aria-label={brand}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 19 12 5.5 20 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m8.5 15.5 3.5-6 3.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
                    </svg>
                    <span className="wayfinder-brand-name">{brand}</span>
                </Link>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitch />
                </div>
            </div>
        </header>
    )
}
