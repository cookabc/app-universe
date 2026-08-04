'use client'

import { MagnifyingGlassIcon, ShuffleIcon, SortAscendingIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { TagFilter } from '@/components/TagFilter'
import { ToolCard } from '@/components/ToolCard'
import tools, { CATEGORY_LABELS, CATEGORY_ORDER, groupToolsByCategory, type Tool } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { filterTools } from '@/lib/filter-tools'
import { shuffleDifferent } from '@/lib/shuffle'

type SortMode = 'curated' | 'shuffle'

export function ToolGrid() {
    const { t, i18n, isReady } = useI18nReady()

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

    const orderedTools = sortMode === 'shuffle' ? shuffledTools : tools
    const featuredTools = useMemo(() => tools.filter((tool) => tool.featured), [])

    const filtered = useMemo(
        () => filterTools(orderedTools, activeTag, searchQuery),
        [searchQuery, activeTag, orderedTools],
    )

    const isFiltering = activeTag !== 'all' || searchQuery.trim().length > 0

    const groupedTools = useMemo(() => {
        if (isFiltering) return null
        return groupToolsByCategory(orderedTools)
    }, [isFiltering, orderedTools])

    const showFeatured =
        sortMode === 'curated' && activeTag === 'all' && !searchQuery.trim() && featuredTools.length > 0

    const clearFilters = () => {
        setSearchQuery('')
        setActiveTag('all')
    }

    const handleTagClick = (tag: string) => {
        setActiveTag(tag)
        setSearchQuery('')
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const handleCuratedSort = () => {
        setSortMode('curated')
    }

    const handleShuffleSort = () => {
        setShuffledTools((current) => shuffleDifferent(tools, sortMode === 'shuffle' ? current : tools))
        setSortMode('shuffle')
    }

    const curatedLabel = isReady ? t('toolsWall.sortCurated') : 'Curated order'
    const shuffleLabel = isReady ? t('toolsWall.sortShuffle') : 'Shuffle'
    const featuredTitle = isReady ? t('toolsWall.featuredTitle') : 'Featured picks'
    const featuredSubtitle = isReady ? t('toolsWall.featuredSubtitle') : 'Tools I reach for first'
    const discoveryLabel = isReady ? t('toolsWall.discoveryLabel') : 'Discovery controls'
    const featuredEyebrow = isReady ? t('toolsWall.featuredEyebrow') : 'Curator signal'
    const allToolsEyebrow = isReady ? t('toolsWall.allToolsEyebrow') : 'Complete index'

    return (
        <div className="space-y-20">
            <section className="discovery-rail -mx-4 px-4 py-4 sm:mx-0 sm:px-5" aria-label={discoveryLabel}>
                <div className="grid gap-4 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)] lg:items-center">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                        <div className="min-w-0 flex-1">
                            <TagFilter tools={tools} activeTag={activeTag} onTagChange={setActiveTag} />
                        </div>
                        <div
                            className="flex shrink-0 items-center justify-end gap-2 self-start lg:self-start"
                            role="group"
                            aria-label={isReady ? t('toolsWall.sortLabel') : 'Sort tools'}
                        >
                            <button
                                type="button"
                                onClick={handleCuratedSort}
                                className={`index-label inline-flex min-h-11 items-center gap-1.5 border px-3 transition-colors ${
                                    sortMode === 'curated'
                                        ? 'index-label--inverse border-foreground bg-foreground'
                                        : 'border-border bg-card hover:border-foreground hover:text-foreground'
                                }`}
                                aria-pressed={sortMode === 'curated'}
                            >
                                <SortAscendingIcon className="h-3.5 w-3.5" weight="bold" />
                                {curatedLabel}
                            </button>
                            <button
                                type="button"
                                onClick={handleShuffleSort}
                                className={`index-label inline-flex min-h-11 items-center gap-1.5 border px-3 transition-colors ${
                                    sortMode === 'shuffle'
                                        ? 'index-label--inverse border-foreground bg-foreground'
                                        : 'border-border bg-card hover:border-foreground hover:text-foreground'
                                }`}
                                aria-pressed={sortMode === 'shuffle'}
                            >
                                <ShuffleIcon className="h-3.5 w-3.5" weight="bold" />
                                {shuffleLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {showFeatured && (
                <section className="space-y-7" aria-labelledby="featured-heading">
                    <div className="flex items-end justify-between gap-4 border-b-2 border-foreground pb-3">
                        <div>
                            <p className="index-label index-label--accent mb-2">{featuredEyebrow}</p>
                            <h2 id="featured-heading" className="display-heading text-3xl text-foreground">
                                {featuredTitle}
                            </h2>
                        </div>
                        <p className="index-label hidden sm:block">{featuredSubtitle}</p>
                    </div>
                    <div className="featured-grid grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {featuredTools.map((tool, index) => (
                            <ToolCard
                                key={`featured-${tool.id}`}
                                tool={tool}
                                variant="featured"
                                featuredIndex={index}
                                onTagClick={handleTagClick}
                            />
                        ))}
                    </div>
                </section>
            )}

            {isFiltering ? (
                <section className="space-y-7" aria-label="Search results">
                    <div className="flex items-end justify-between gap-4 border-b-2 border-foreground pb-3">
                        <div>
                            <p className="index-label index-label--accent mb-2">{allToolsEyebrow}</p>
                            <h2 className="display-heading text-3xl text-foreground">
                                {isReady ? t('toolsWall.allToolsTitle') : 'All tools'}
                            </h2>
                        </div>
                        <p className="index-label" aria-live="polite">
                            {isReady
                                ? t('toolsWall.resultCount', { shown: filtered.length, total: tools.length })
                                : `Showing ${filtered.length} of ${tools.length}`}
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center border border-border px-6">
                            <MagnifyingGlassIcon className="h-10 w-10 text-muted-foreground/40 mb-4" weight="duotone" />
                            <p className="display-heading text-xl text-foreground">
                                {isReady ? t('toolsWall.noResults') : 'No tools found'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2 max-w-sm text-pretty">
                                {isReady ? t('toolsWall.noResultsHint') : 'Try a different keyword or tag'}
                            </p>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="index-label index-label--foreground mt-6 pb-1 border-b border-foreground hover:opacity-70 transition-opacity"
                            >
                                {isReady ? t('toolsWall.clearFilters') : 'Clear filters'}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((tool) => (
                                <ToolCard key={tool.id} tool={tool} onTagClick={handleTagClick} />
                            ))}
                        </div>
                    )}
                </section>
            ) : (
                <div className="space-y-20">
                    {CATEGORY_ORDER.map((category) => {
                        const categoryTools = groupedTools?.[category] ?? []
                        if (categoryTools.length === 0) return null
                        const labels = CATEGORY_LABELS[category]
                        const lang = isReady ? (i18n.language || 'en').split('-')[0] : 'en'
                        const title = labels[lang === 'zh' ? 'zh' : 'en']
                        const eyebrow = labels.eyebrow[lang === 'zh' ? 'zh' : 'en']
                        return (
                            <section key={category} className="space-y-7" aria-label={title}>
                                <div className="flex items-end justify-between gap-4 border-b-2 border-foreground pb-3">
                                    <div>
                                        <p className="index-label index-label--accent mb-2">{eyebrow}</p>
                                        <h2 className="display-heading text-3xl text-foreground">{title}</h2>
                                    </div>
                                    <p className="index-label">{categoryTools.length}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {categoryTools.map((tool) => (
                                        <ToolCard key={tool.id} tool={tool} onTagClick={handleTagClick} />
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
