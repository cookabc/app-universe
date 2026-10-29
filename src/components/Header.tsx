'use client'

import Link from 'next/link'
import { ThemeSwitch } from '@/components/theme-switch'
import { useI18nReady } from '@/hooks/useI18nReady'
import { LanguageSwitcher } from './LanguageSwitcher'

export const Header = () => {
    const { t, isReady } = useI18nReady()
    const brand = isReady ? t('brand.name') : 'Wayfinder'

    return (
        <header className="wayfinder-header sticky top-0 z-[var(--z-header)] w-full">
            <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="wayfinder-wordmark group flex min-h-11 items-center gap-3" aria-label={brand}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true">
                        <path d="M4 19 12.5 5 21 19" stroke="currentColor" strokeWidth="1.5" />
                        <path d="m8 15 4.5-7 4.5 7" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12.5" cy="18.5" r="2" fill="currentColor" />
                    </svg>
                    <span className="display-heading text-base leading-none tracking-[-0.02em] group-hover:text-primary transition-colors">
                        {brand}
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitch />
                </div>
            </div>
        </header>
    )
}
