'use client'

import Link from 'next/link'
import { useI18nReady } from '@/hooks/useI18nReady'

export default function NotFound() {
    const { t, isReady } = useI18nReady()

    return (
        <section className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <p className="text-sm font-medium text-primary mb-2">{isReady ? t('notFound.code') : '404'}</p>
                <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
                    {isReady ? t('notFound.title') : 'Page not found'}
                </h1>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                    {isReady ? t('notFound.body') : 'The page you are looking for does not exist or has been moved.'}
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius)] bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                    {isReady ? t('notFound.cta') : 'Go back home'}
                </Link>
            </div>
        </section>
    )
}
