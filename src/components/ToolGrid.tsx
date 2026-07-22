'use client'

import { MagnifyingGlassIcon, ShuffleIcon, SortAscendingIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { TagFilter } from '@/components/TagFilter'
import { ToolCard } from '@/components/ToolCard'
import tools, { type Tool } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { filterTools } from '@/lib/filter-tools'
import { shuffle } from '@/lib/shuffle'

type SortMode = 'curated' | 'shuffle'

export function ToolGrid() {
    const { t, isReady } = useI18nReady()

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
        <div className="space-y-10">
            <div className="space-y-6">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <TagFilter tools={tools} activeTag={activeTag} onTagChange={setActiveTag} />
                    <div
                        className="flex shrink-0 items-center gap-4 self-start"
                        role="group"
                        aria-label={isReady ? t('toolsWall.sortLabel') : 'Sort tools'}
                    >
                        <button
                            type="button"
                            onClick={() => setSortMode('curated')}
                            className={`index-label inline-flex items-center gap-1.5 transition-colors ${
                                sortMode === 'curated' ? 'text-foreground' : 'hover:text-foreground'
                            }`}
                            aria-pressed={sortMode === 'curated'}
                        >
                            <SortAscendingIcon className="h-3.5 w-3.5" weight="bold" />
                            {curatedLabel}
                        </button>
                        <button
                            type="button"
                            onClick={() => setSortMode('shuffle')}
                            className={`index-label inline-flex items-center gap-1.5 transition-colors ${
                                sortMode === 'shuffle' ? 'text-foreground' : 'hover:text-foreground'
                            }`}
                            aria-pressed={sortMode === 'shuffle'}
                        >
                            <ShuffleIcon className="h-3.5 w-3.5" weight="bold" />
                            {shuffleLabel}
                        </button>
                    </div>
                </div>
            </div>

            {showFeatured && (
                <section className="space-y-5" aria-labelledby="featured-heading">
                    <div className="flex items-baseline justify-between gap-4">
                        <h2 id="featured-heading" className="serif-display text-2xl text-foreground">
                            {featuredTitle}
                        </h2>
                        <p className="index-label hidden sm:block">{featuredSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredTools.map((tool) => (
                            <ToolCard
                                key={`featured-${tool.id}`}
                                tool={tool}
                                variant="featured"
                                onTagClick={handleTagClick}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="space-y-5" aria-label="All tools">
                <div className="flex items-baseline justify-between gap-4">
                    <h2 className="serif-display text-2xl text-foreground">
                        {isReady ? t('toolsWall.allToolsTitle') : 'All tools'}
                    </h2>
                    {(searchQuery || activeTag !== 'all') && (
                        <p className="index-label" aria-live="polite">
                            {isReady
                                ? t('toolsWall.resultCount', { shown: filtered.length, total: tools.length })
                                : `Showing ${filtered.length} of ${tools.length}`}
                        </p>
                    )}
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center border border-border px-6">
                        <MagnifyingGlassIcon className="h-10 w-10 text-muted-foreground/40 mb-4" weight="duotone" />
                        <p className="serif-display text-xl text-foreground">
                            {isReady ? t('toolsWall.noResults') : 'No tools found'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm text-pretty">
                            {isReady ? t('toolsWall.noResultsHint') : 'Try a different keyword or tag'}
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="index-label mt-6 pb-1 border-b border-foreground text-foreground hover:opacity-70 transition-opacity"
                        >
                            {isReady ? t('toolsWall.clearFilters') : 'Clear filters'}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((tool, i) => (
                            <ToolCard key={tool.id} tool={tool} index={i} onTagClick={handleTagClick} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
