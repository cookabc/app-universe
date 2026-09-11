'use client'

import Link from 'next/link'
import { useState } from 'react'
import { normalizeLanguage } from '@/components/I18nProvider'
import { getAllTags, getToolPath, default as TOOLS } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { getDomain } from '@/lib/filter-tools'
import { getIcon } from '@/lib/icon-map'

const MOSAIC_COLS = 6
const BLANK_CELL_KEYS = ['slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5']

export default function Hero() {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const [imgError, setImgError] = useState<Record<string, boolean>>({})

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

    const rangeLabel = `№ 001–${String(toolCount).padStart(3, '0')}`
    const blankCells = (MOSAIC_COLS - (toolCount % MOSAIC_COLS)) % MOSAIC_COLS

    return (
        <section className="signal-grid border-b-2 border-foreground">
            <div className="container max-w-7xl mx-auto grid gap-10 px-4 py-16 sm:py-20 lg:grid-cols-12 lg:items-start lg:gap-8 lg:py-24">
                <div className="lg:col-span-7">
                    <p className="index-label index-label--accent mb-5">{eyebrow}</p>
                    <h1 className="display-heading max-w-[13ch] text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.055em] text-foreground text-balance">
                        {title} <span className="marker-highlight">{titleAccent}</span>
                    </h1>
                    <p className="measure mt-7 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                        {subtitle}
                    </p>
                    <a href="#tools" className="signal-button mt-8 inline-flex min-h-11 items-center gap-3 px-5 py-3">
                        {cta}
                        <span aria-hidden="true">↓</span>
                    </a>
                </div>
                <aside className="signal-card relative p-4 sm:p-5 lg:col-span-5 lg:mt-7" aria-label={indexTitle}>
                    <span className="signal-sticker" aria-hidden="true">
                        ✦
                    </span>
                    <div className="flex items-baseline justify-between gap-3 pb-4">
                        <h2 className="display-heading text-xl">{indexTitle}</h2>
                        <p className="index-label index-label--primary">{rangeLabel}</p>
                    </div>
                    <ul className="grid grid-cols-6 gap-px border-2 border-foreground bg-border">
                        {TOOLS.map((tool, index) => {
                            const name = tool.name[lang] || tool.name.en
                            const CellIcon = getIcon(tool.icon)
                            return (
                                <li key={tool.id} className="group relative aspect-square overflow-hidden bg-card">
                                    <Link href={getToolPath(tool.id)} aria-label={name} className="block h-full w-full">
                                        {!imgError[tool.id] ? (
                                            <img
                                                src={`/previews/${tool.id}.png`}
                                                alt=""
                                                width={96}
                                                height={96}
                                                decoding="async"
                                                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110"
                                                onError={() => setImgError((prev) => ({ ...prev, [tool.id]: true }))}
                                            />
                                        ) : (
                                            <div
                                                className="flex h-full items-center justify-center"
                                                style={{ backgroundColor: `${tool.color}15` }}
                                            >
                                                <CellIcon
                                                    className="h-4 w-4"
                                                    style={{ color: tool.color }}
                                                    weight="duotone"
                                                />
                                            </div>
                                        )}
                                        <span
                                            aria-hidden="true"
                                            className="mosaic-caption pointer-events-none absolute inset-x-0 bottom-0 bg-accent px-1 py-0.5 text-accent-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                                        >
                                            <span className="block truncate">
                                                {`№ ${String(index + 1).padStart(3, '0')} · ${name}`}
                                            </span>
                                            <span className="block truncate opacity-75">{getDomain(tool.url)}</span>
                                        </span>
                                    </Link>
                                </li>
                            )
                        })}
                        {BLANK_CELL_KEYS.slice(0, blankCells).map((key) => (
                            <li key={key} aria-hidden="true" className="relative aspect-square bg-background">
                                <span className="absolute inset-0 grid place-items-center font-mono text-sm text-border">
                                    +
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="index-label mt-4 border-t border-border pt-4">
                        {statsTools} · {statsTags} · {languageStat} · {updateStat}
                    </p>
                    <div className="coordinate-rule mt-4" aria-hidden="true" />
                </aside>
            </div>
        </section>
    )
}
