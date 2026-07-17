'use client'

import { MagnifyingGlassIcon, ShuffleIcon, SortAscendingIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { TagFilter } from '@/components/TagFilter'
import { ToolCard } from '@/components/ToolCard'
import tools, { formatTag, type Tool } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { shuffle } from '@/lib/shuffle'

const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.12 } },
}
const itemReduced = { hidden: { opacity: 1 }, show: { opacity: 1 }, exit: { opacity: 0 } }

function normalizeQuery(value: string): string {
    return value.toLowerCase().replace(/[-\s_./]+/g, '')
}

function getDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

function filterTools(list: Tool[], activeTag: string, searchQuery: string): Tool[] {
    let result = list

    if (activeTag !== 'all') {
        result = result.filter((tool) => tool.tags.includes(activeTag))
    }

    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const qNorm = normalizeQuery(q)
        result = result.filter((tool) => {
            const nameMatch = tool.name.en.toLowerCase().includes(q) || tool.name.zh.toLowerCase().includes(q)
            const descMatch =
                tool.description.en.toLowerCase().includes(q) || tool.description.zh.toLowerCase().includes(q)
            const noteMatch =
                (tool.note?.en.toLowerCase().includes(q) ?? false) || (tool.note?.zh.toLowerCase().includes(q) ?? false)
            const tagMatch = tool.tags.some(
                (tag) =>
                    tag.includes(q) ||
                    normalizeQuery(tag).includes(qNorm) ||
                    formatTag(tag).toLowerCase().includes(q) ||
                    normalizeQuery(formatTag(tag)).includes(qNorm),
            )
            const domainMatch = getDomain(tool.url).toLowerCase().includes(q)
            return nameMatch || descMatch || noteMatch || tagMatch || domainMatch
        })
    }

    return result
}

type SortMode = 'curated' | 'shuffle'

export function ToolGrid() {
    const { t, isReady } = useI18nReady()
    const shouldReduceMotion = useReducedMotion()

    const [searchQuery, setSearchQuery] = useState('')
    const [activeTag, setActiveTag] = useState('all')
    const [sortMode, setSortMode] = useState<SortMode>('curated')
    const [shuffledTools, setShuffledTools] = useState<Tool[]>(tools)

    // Deep-link from tool pages: /?tag=ai-design#tools
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const tag = params.get('tag')
        if (tag && (tag === 'all' || tools.some((tool) => tool.tags.includes(tag)))) {
            setActiveTag(tag)
        }
    }, [])

    useEffect(() => {
        if (sortMode === 'shuffle') {
            setShuffledTools(shuffle(tools))
        }
    }, [sortMode])

    const orderedTools = sortMode === 'shuffle' ? shuffledTools : tools
    const featuredTools = useMemo(() => tools.filter((tool) => tool.featured), [])

    const filtered = useMemo(
        () => filterTools(orderedTools, activeTag, searchQuery),
        [searchQuery, activeTag, orderedTools],
    )

    const showFeatured = activeTag === 'all' && !searchQuery.trim() && featuredTools.length > 0

    const clearFilters = () => {
        setSearchQuery('')
        setActiveTag('all')
    }

    const handleTagClick = (tag: string) => {
        setActiveTag(tag)
        setSearchQuery('')
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const curatedLabel = isReady ? t('toolsWall.sortCurated') : 'Curated order'
    const shuffleLabel = isReady ? t('toolsWall.sortShuffle') : 'Shuffle'
    const featuredTitle = isReady ? t('toolsWall.featuredTitle') : 'Featured picks'
    const featuredSubtitle = isReady ? t('toolsWall.featuredSubtitle') : 'Tools I reach for first'

    return (
        <div className="relative space-y-5">
            <div className="pointer-events-none absolute -inset-x-4 -top-16 h-[28rem] bg-ambient" aria-hidden="true" />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <TagFilter tools={tools} activeTag={activeTag} onTagChange={setActiveTag} />
                <div
                    className="flex shrink-0 items-center gap-1 self-start rounded-[var(--radius-inner)] border border-border bg-card p-0.5"
                    role="group"
                    aria-label={isReady ? t('toolsWall.sortLabel') : 'Sort tools'}
                >
                    <button
                        type="button"
                        onClick={() => setSortMode('curated')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-[calc(var(--radius-inner)-2px)] transition-colors ${
                            sortMode === 'curated'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        aria-pressed={sortMode === 'curated'}
                    >
                        <SortAscendingIcon className="h-3.5 w-3.5" weight="bold" />
                        {curatedLabel}
                    </button>
                    <button
                        type="button"
                        onClick={() => setSortMode('shuffle')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-[calc(var(--radius-inner)-2px)] transition-colors ${
                            sortMode === 'shuffle'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        aria-pressed={sortMode === 'shuffle'}
                    >
                        <ShuffleIcon className="h-3.5 w-3.5" weight="bold" />
                        {shuffleLabel}
                    </button>
                </div>
            </div>

            {showFeatured && (
                <section className="space-y-3" aria-labelledby="featured-heading">
                    <div>
                        <h2 id="featured-heading" className="text-sm font-semibold text-foreground tracking-tight">
                            {featuredTitle}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{featuredSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredTools.map((tool) => (
                            <ToolCard
                                key={`featured-${tool.id}`}
                                tool={tool}
                                variant="featured"
                                onTagClick={handleTagClick}
                            />
                        ))}
                    </div>
                    <div className="border-t border-border/60 pt-2">
                        <p className="text-xs font-medium text-muted-foreground">
                            {isReady ? t('toolsWall.allToolsTitle') : 'All tools'}
                        </p>
                    </div>
                </section>
            )}

            {(searchQuery || activeTag !== 'all') && (
                <p className="text-xs text-muted-foreground" aria-live="polite">
                    {isReady
                        ? t('toolsWall.resultCount', { shown: filtered.length, total: tools.length })
                        : `Showing ${filtered.length} of ${tools.length}`}
                </p>
            )}

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MagnifyingGlassIcon className="h-12 w-12 text-muted-foreground/40 mb-4" weight="duotone" />
                    <p className="text-base font-medium text-foreground">
                        {isReady ? t('toolsWall.noResults') : 'No tools found'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isReady ? t('toolsWall.noResultsHint') : 'Try a different keyword or tag'}
                    </p>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 px-4 py-2 text-sm font-medium radius-inner border border-border bg-card text-foreground hover:border-primary/30 transition-colors"
                    >
                        {isReady ? t('toolsWall.clearFilters') : 'Clear filters'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {filtered.map((tool) => (
                            <motion.div
                                key={tool.id}
                                className="h-full"
                                initial={shouldReduceMotion ? undefined : 'hidden'}
                                animate={shouldReduceMotion ? undefined : 'show'}
                                exit={shouldReduceMotion ? undefined : 'exit'}
                                variants={shouldReduceMotion ? itemReduced : item}
                            >
                                <ToolCard tool={tool} onTagClick={handleTagClick} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
