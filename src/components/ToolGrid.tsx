'use client'

import { LinkIcon, MagnifyingGlassIcon, ShuffleIcon, SortAscendingIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { DossierRow } from '@/components/DossierRow'
import { normalizeLanguage } from '@/components/I18nProvider'
import { SearchBar } from '@/components/SearchBar'
import { TagFilter } from '@/components/TagFilter'
import { ToolCard } from '@/components/ToolCard'
import tools, { CATEGORY_LABELS, CATEGORY_ORDER, getFeaturedTools, groupToolsByCategory } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { withTagParam } from '@/lib/discovery-url'
import { filterTools } from '@/lib/filter-tools'
import { parseSeed, randomSeed, seededShuffle, seedToNumber } from '@/lib/shuffle'

type SortMode = 'curated' | 'shuffle'

export function ToolGrid() {
    const { t, i18n, isReady } = useI18nReady()

    const [searchQuery, setSearchQuery] = useState('')
    const [activeTag, setActiveTag] = useState('all')
    const [sortMode, setSortMode] = useState<SortMode>('curated')
    const [shuffleSeed, setShuffleSeed] = useState<string | null>(null)
    const [linkCopied, setLinkCopied] = useState(false)

    // Deep-links: /?tag=ai-design#tools and shareable shuffle /?seed=xxxxxx
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const tag = params.get('tag')
        if (tag && (tag === 'all' || tools.some((tool) => tool.tags.includes(tag)))) {
            setActiveTag(tag)
        }
        const seedParam = params.get('seed')
        if (parseSeed(seedParam) !== null) {
            setShuffleSeed(seedParam)
            setSortMode('shuffle')
        }
    }, [])

    const shuffledTools = useMemo(
        () => (shuffleSeed ? seededShuffle(tools, seedToNumber(shuffleSeed)) : tools),
        [shuffleSeed],
    )

    const orderedTools = sortMode === 'shuffle' ? shuffledTools : tools
    const featuredTools = useMemo(() => getFeaturedTools(), [])

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

    const syncTag = (tag: string) => {
        window.history.replaceState(null, '', withTagParam(window.location.href, tag))
    }

    const handleTagChange = (tag: string) => {
        setActiveTag(tag)
        syncTag(tag)
    }

    const clearFilters = () => {
        setSearchQuery('')
        handleTagChange('all')
    }

    const handleTagClick = (tag: string) => {
        handleTagChange(tag)
        setSearchQuery('')
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const syncUrl = (seed: string | null) => {
        const url = new URL(window.location.href)
        if (seed) {
            url.searchParams.set('seed', seed)
        } else {
            url.searchParams.delete('seed')
        }
        window.history.replaceState(null, '', url)
    }

    const handleCuratedSort = () => {
        setSortMode('curated')
        syncUrl(null)
    }

    const handleShuffleSort = () => {
        const seed = randomSeed()
        setShuffleSeed(seed)
        setSortMode('shuffle')
        syncUrl(seed)
        setLinkCopied(false)
    }

    const handleCopySignalLink = async () => {
        if (!shuffleSeed) return
        const url = new URL(window.location.href)
        url.searchParams.set('seed', shuffleSeed)
        try {
            await navigator.clipboard.writeText(url.toString())
            setLinkCopied(true)
            setTimeout(() => setLinkCopied(false), 2000)
        } catch {
            // Clipboard unavailable; the seed is still visible in the URL.
        }
    }

    const curatedLabel = isReady ? t('toolsWall.sortCurated') : 'Curated order'
    const shuffleLabel = isReady ? t('toolsWall.sortShuffle') : 'Shuffle'
    const featuredTitle = isReady ? t('toolsWall.featuredTitle') : 'Featured picks'
    const featuredSubtitle = isReady ? t('toolsWall.featuredSubtitle') : 'Tools I reach for first'
    const discoveryLabel = isReady ? t('toolsWall.discoveryLabel') : 'Discovery controls'
    const featuredEyebrow = isReady ? t('toolsWall.featuredEyebrow') : 'Curator signal'
    const allToolsEyebrow = isReady ? t('toolsWall.allToolsEyebrow') : 'Complete index'
    const signalMapLabel = isReady ? t('toolsWall.signalMap') : 'Signal map'
    const signalMapHint = isReady ? t('toolsWall.signalMapHint') : 'This order is reproducible — share the link'
    const copyLinkLabel = isReady ? t('toolsWall.copyLink') : 'Copy link'
    const linkCopiedLabel = isReady ? t('toolsWall.linkCopied') : 'Copied'

    return (
        <div className="atlas-index space-y-20">
            <section className="discovery-rail -mx-4 px-4 py-4 sm:mx-0 sm:px-5" aria-label={discoveryLabel}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="lg:w-[18rem] lg:shrink-0">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <TagFilter tools={tools} activeTag={activeTag} onTagChange={handleTagChange} />
                    </div>
                    <div
                        className="flex shrink-0 items-center gap-2"
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
            </section>

            {sortMode === 'shuffle' && shuffleSeed && (
                <section
                    className="flex flex-wrap items-center gap-x-5 gap-y-3 border border-foreground bg-accent px-4 py-3 sm:px-5"
                    aria-label={signalMapLabel}
                >
                    <p className="index-label index-label--accent-foreground inline-flex items-center gap-2">
                        <span aria-hidden="true">✦</span>
                        {signalMapLabel}
                    </p>
                    <p className="index-label index-label--accent-foreground border border-accent-foreground/40 px-2 py-1">
                        № {shuffleSeed}
                    </p>
                    <p className="index-label index-label--accent-foreground hidden opacity-70 sm:block">
                        {signalMapHint}
                    </p>
                    <span className="flex items-center gap-2 sm:ml-auto">
                        <button
                            type="button"
                            onClick={handleCopySignalLink}
                            className="index-label index-label--accent-foreground inline-flex min-h-11 items-center gap-1.5 border border-accent-foreground bg-transparent px-3 hover:bg-accent-foreground hover:text-accent transition-colors"
                        >
                            <LinkIcon className="h-3.5 w-3.5" weight="bold" />
                            {linkCopied ? linkCopiedLabel : copyLinkLabel}
                        </button>
                        <button
                            type="button"
                            onClick={handleCuratedSort}
                            aria-label={curatedLabel}
                            className="index-label index-label--accent-foreground inline-flex min-h-11 w-11 items-center justify-center border border-accent-foreground hover:bg-accent-foreground hover:text-accent transition-colors"
                        >
                            <XIcon className="h-3.5 w-3.5" weight="bold" />
                        </button>
                    </span>
                </section>
            )}

            {showFeatured && (
                <section className="space-y-7" aria-labelledby="featured-heading">
                    <div className="flex items-end justify-between gap-4 border-b border-foreground pb-3">
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
                    <div className="flex items-end justify-between gap-4 border-b border-foreground pb-3">
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
                            <p className="display-heading text-base text-foreground">
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
                        <div className="dossier-list">
                            {filtered.map((tool) => (
                                <DossierRow key={tool.id} tool={tool} onTagClick={handleTagClick} />
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
                        const lang = normalizeLanguage(i18n.language)
                        const title = labels[lang]
                        const eyebrow = labels.eyebrow[lang]
                        return (
                            <section key={category} className="space-y-7" aria-label={title}>
                                <div className="flex items-end justify-between gap-4 border-b border-foreground pb-3">
                                    <div>
                                        <p className="index-label index-label--accent mb-2">{eyebrow}</p>
                                        <h2 className="display-heading text-3xl text-foreground">{title}</h2>
                                    </div>
                                    <p className="index-label">{categoryTools.length}</p>
                                </div>
                                <div className="dossier-list">
                                    {categoryTools.map((tool) => (
                                        <DossierRow key={tool.id} tool={tool} onTagClick={handleTagClick} />
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
