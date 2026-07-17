'use client'

import Link from 'next/link'
import { ThemeSwitch } from '@/components/theme-switch'
import { useI18nReady } from '@/hooks/useI18nReady'
import { LanguageSwitcher } from './LanguageSwitcher'

export const Header = () => {
    const { t, isReady } = useI18nReady()
    const brand = isReady ? t('brand.name') : 'App Universe'

    return (
        <header className="sticky top-0 z-[var(--z-header)] w-full bg-background/75 backdrop-blur-xl border-b border-border/60">
            <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground hover:text-primary transition-colors"
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 125 125"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <circle cx="62.5" cy="62.5" r="58" stroke="currentColor" strokeWidth="8" />
                        <circle cx="62.5" cy="62.5" r="32" stroke="currentColor" strokeWidth="8" />
                        <circle cx="62.5" cy="62.5" r="10" fill="currentColor" />
                    </svg>
                    {brand}
                </Link>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <ThemeSwitch />
                </div>
            </div>
        </header>
    )
}
