'use client'

import { useReducedMotion } from 'framer-motion'
import { getAllTags, default as TOOLS } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

export default function Hero() {
    const { t, isReady } = useI18nReady()
    const shouldReduceMotion = useReducedMotion()

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
        <section className="bg-grid-faint border-b border-border">
            <div className="container max-w-7xl mx-auto px-4 pt-24 pb-20 sm:pt-32 sm:pb-28">
                <p className="index-label mb-6">Index — curated {new Date().getFullYear()}</p>
                <h1
                    className="serif-display text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-foreground max-w-[14ch]"
                    style={shouldReduceMotion ? undefined : { animation: 'fade-in-up 0.6s ease-out both' }}
                >
                    {title} <em className="not-italic sm:italic text-muted-foreground">{titleAccent}</em>
                </h1>
                <p className="measure mt-8 text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
                    {subtitle}
                </p>
                <hr className="hairline mt-10 mb-4" />
                <div className="flex items-center justify-between text-sm">
                    <span className="index-label">{statsTools}</span>
                    <span className="index-label">{statsTags}</span>
                </div>
            </div>
        </section>
    )
}
