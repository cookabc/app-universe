'use client'

import { getAllTags, default as TOOLS } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

export default function Hero() {
    const { t, isReady } = useI18nReady()

    const title = isReady ? t('hero.title') : 'Discover tools that'
    const titleAccent = isReady ? t('hero.titleAccent') : 'earn their place.'
    const subtitle = isReady
        ? t('hero.subtitle')
        : 'A hand-curated field guide for design, code, and creative work—with honest notes on when to use each tool.'
    const toolCount = TOOLS.length
    const tagCount = getAllTags(TOOLS).length
    const statsTools = isReady ? t('hero.statsTools', { count: toolCount }) : `${toolCount}+ tools`
    const statsTags = isReady ? t('hero.statsTags', { count: tagCount }) : `${tagCount} tags`
    const eyebrow = isReady ? t('hero.eyebrow') : 'Human-curated field guide'
    const indexTitle = isReady ? t('hero.indexTitle') : 'Archive index'
    const languageStat = isReady ? t('hero.statsLanguage') : 'Bilingual'
    const updateStat = isReady ? t('hero.statsUpdated') : 'Updated July 2026'
    const cta = isReady ? t('hero.cta') : 'Explore the archive'
    const entriesLabel = isReady ? t('hero.entriesLabel') : 'Entries'
    const categoriesLabel = isReady ? t('hero.categoriesLabel') : 'Categories'
    const languageLabel = isReady ? t('hero.languageLabel') : 'Language'
    const statusLabel = isReady ? t('hero.statusLabel') : 'Status'

    return (
        <section className="signal-grid border-b-2 border-foreground">
            <div className="container max-w-7xl mx-auto grid gap-10 px-4 py-16 sm:py-20 lg:grid-cols-12 lg:items-start lg:gap-8 lg:py-24">
                <div className="lg:col-span-7">
                    <p className="index-label index-label--accent mb-5">{eyebrow}</p>
                    <h1 className="display-heading max-w-[13ch] text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.055em] text-foreground text-balance">
                        {title} <span className="text-primary">{titleAccent}</span>
                    </h1>
                    <p className="measure mt-7 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                        {subtitle}
                    </p>
                    <a href="#tools" className="signal-button mt-8 inline-flex min-h-11 items-center gap-3 px-5 py-3">
                        {cta}
                        <span aria-hidden="true">↓</span>
                    </a>
                </div>
                <aside className="signal-card relative p-6 sm:p-7 lg:col-span-5 lg:mt-7" aria-label={indexTitle}>
                    <span className="signal-sticker" aria-hidden="true">
                        ✦
                    </span>
                    <h2 className="display-heading border-b border-border pb-4 text-xl">{indexTitle}</h2>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-7 pt-6">
                        <div>
                            <dt className="index-label">{entriesLabel}</dt>
                            <dd className="display-heading mt-1 text-xl">{statsTools}</dd>
                        </div>
                        <div>
                            <dt className="index-label">{categoriesLabel}</dt>
                            <dd className="display-heading mt-1 text-xl">{statsTags}</dd>
                        </div>
                        <div>
                            <dt className="index-label">{languageLabel}</dt>
                            <dd className="display-heading mt-1 text-xl">{languageStat}</dd>
                        </div>
                        <div>
                            <dt className="index-label">{statusLabel}</dt>
                            <dd className="display-heading mt-1 text-xl">{updateStat}</dd>
                        </div>
                    </dl>
                    <div className="coordinate-rule mt-7" aria-hidden="true" />
                </aside>
            </div>
        </section>
    )
}
