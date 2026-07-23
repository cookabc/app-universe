'use client'

import { getAllTags, default as TOOLS } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

export default function Hero() {
    const { t, isReady } = useI18nReady()

    const title = isReady ? t('hero.title') : 'Discover tools that'
    const titleAccent = isReady ? t('hero.titleAccent') : 'actually work'
    const subtitle = isReady
        ? t('hero.subtitle')
        : 'A curated collection of apps and tools I actually use — for design, productivity, and more.'
    const toolCount = TOOLS.length
    const tagCount = getAllTags(TOOLS).length
    const statsTools = isReady ? t('hero.statsTools', { count: toolCount }) : `${toolCount}+ tools`
    const statsTags = isReady ? t('hero.statsTags', { count: tagCount }) : `${tagCount} tags`

    return (
        <section className="bg-lined-paper border-b-2 border-foreground">
            <div className="container max-w-7xl mx-auto px-4 pt-16 pb-14 sm:pt-20 sm:pb-16">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="index-label mb-3">Archive of practice</p>
                        <h1 className="serif-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-foreground max-w-[14ch]">
                            {title} <em className="italic">{titleAccent}</em>
                        </h1>
                    </div>
                    <span className="archive-tab hidden sm:inline-block mt-2 flex-shrink-0">{statsTools}</span>
                </div>
                <p className="measure mt-6 text-base leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>
                <div className="mt-8 flex items-center gap-4 sm:hidden">
                    <span className="archive-tab">{statsTools}</span>
                    <span className="index-label">{statsTags}</span>
                </div>
                <div className="mt-10 hidden sm:flex items-center justify-between border-t border-border pt-3">
                    <span className="index-label">Curated by hand — {statsTags}</span>
                    <span className="index-label">Updated July 2026</span>
                </div>
            </div>
        </section>
    )
}
