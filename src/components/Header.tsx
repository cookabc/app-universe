'use client'

import Link from 'next/link'
import { ThemeSwitch } from '@/components/theme-switch'
import { useI18nReady } from '@/hooks/useI18nReady'
import { LanguageSwitcher } from './LanguageSwitcher'

export const Header = () => {
    const { t, isReady } = useI18nReady()
    const brand = isReady ? t('brand.name') : 'App Universe'

    return (
        <header className="sticky top-0 z-[var(--z-header)] w-full bg-background/90 backdrop-blur-sm border-b border-border">
            <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-baseline gap-2 text-foreground hover:opacity-70 transition-opacity"
                >
                    <span className="serif-display text-lg leading-none">{brand}</span>
                    <span className="archive-tab hidden sm:inline">Archive</span>
                </Link>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <ThemeSwitch />
                </div>
            </div>
        </header>
    )
}
