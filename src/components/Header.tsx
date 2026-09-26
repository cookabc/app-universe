'use client'

import Link from 'next/link'
import { ThemeSwitch } from '@/components/theme-switch'
import { useI18nReady } from '@/hooks/useI18nReady'
import { LanguageSwitcher } from './LanguageSwitcher'

export const Header = () => {
    const { t, isReady } = useI18nReady()
    const brand = isReady ? t('brand.name') : 'App Universe'

    return (
        <header className="atlas-header sticky top-0 z-[var(--z-header)] w-full bg-background border-b-2 border-foreground">
            <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="group flex min-h-11 items-center gap-3 text-foreground">
                    <span className="signal-mark" aria-hidden="true">
                        <span />
                    </span>
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
