'use client'

import Link from 'next/link'
import { useI18nReady } from '@/hooks/useI18nReady'
import { useLocaleHref } from '@/hooks/useLocaleHref'

export default function NotFound() {
    const { t } = useI18nReady()
    const href = useLocaleHref()

    return (
        <section className="min-h-[70vh] flex items-center px-4">
            <div className="container max-w-7xl mx-auto">
                <p className="index-label mb-4">{t('notFound.code')}</p>
                <h1 className="display-heading text-5xl sm:text-6xl text-foreground mb-4 tracking-[-0.04em]">
                    {t('notFound.title')}
                </h1>
                <p className="measure text-base text-muted-foreground mb-8 leading-relaxed">{t('notFound.body')}</p>
                <Link
                    href={href('/')}
                    className="index-label index-label--foreground inline-block pb-1 border-b border-foreground hover:opacity-70 transition-opacity"
                >
                    {t('notFound.cta')} →
                </Link>
                <nav aria-label={t('notFound.resources')} className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="index-label">{t('notFound.resources')}</span>
                    <a
                        href="/sitemap.xml"
                        className="index-label inline-block pb-1 border-b border-transparent hover:border-foreground hover:text-foreground transition-colors"
                    >
                        sitemap.xml
                    </a>
                    <a
                        href="/llms.txt"
                        className="index-label inline-block pb-1 border-b border-transparent hover:border-foreground hover:text-foreground transition-colors"
                    >
                        llms.txt
                    </a>
                    <a
                        href="/tools.json"
                        className="index-label inline-block pb-1 border-b border-transparent hover:border-foreground hover:text-foreground transition-colors"
                    >
                        tools.json
                    </a>
                </nav>
            </div>
        </section>
    )
}
