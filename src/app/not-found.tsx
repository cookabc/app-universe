'use client'

import Link from 'next/link'
import { useI18nReady } from '@/hooks/useI18nReady'

export default function NotFound() {
    const { t, isReady } = useI18nReady()

    return (
        <section className="min-h-[70vh] flex items-center px-4">
            <div className="container max-w-7xl mx-auto">
                <p className="index-label mb-4">{isReady ? t('notFound.code') : '404'}</p>
                <h1 className="serif-display text-5xl sm:text-6xl text-foreground mb-4 tracking-tight">
                    {isReady ? t('notFound.title') : 'Page not found'}
                </h1>
                <p className="measure text-base text-muted-foreground mb-8 leading-relaxed">
                    {isReady ? t('notFound.body') : 'The page you are looking for does not exist or has been moved.'}
                </p>
                <Link
                    href="/"
                    className="index-label inline-block pb-1 border-b border-foreground text-foreground hover:opacity-70 transition-opacity"
                >
                    {isReady ? t('notFound.cta') : 'Go back home'} →
                </Link>
            </div>
        </section>
    )
}
