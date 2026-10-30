'use client'

import {
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    MagnifyingGlassIcon,
    ShuffleIcon,
    XIcon,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import AtlasScene from '@/components/AtlasScene'
import { normalizeLanguage } from '@/components/I18nProvider'
import TOOLS, { type Tool } from '@/data/tools'
import { toolWorkflowIndex, WORKFLOWS } from '@/data/workflow'
import { useI18nReady } from '@/hooks/useI18nReady'
import { readExplorerRoute, writeExplorerRoute } from '@/lib/explorer-route'
import { filterTools, getDomain } from '@/lib/filter-tools'
import { randomSeed, seededShuffle, seedToNumber } from '@/lib/shuffle'

export default function WorkflowMap() {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const [activeFlow, setActiveFlow] = useState(0)
    const [selectedId, setSelectedId] = useState('open-design')
    const [query, setQuery] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [seed, setSeed] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)
    const indexRef = useRef<HTMLButtonElement>(null)
    const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [copyFailed, setCopyFailed] = useState(false)

    useEffect(() => {
        const restore = () => {
            const route = readExplorerRoute(
                window.location.search,
                TOOLS.map((tool) => tool.id),
            )
            const first = route.tool ?? (route.seed ? seededShuffle(TOOLS, seedToNumber(route.seed))[0]?.id : null)
            setSeed(route.seed)
            if (first) {
                setSelectedId(first)
                setActiveFlow(toolWorkflowIndex(first))
            }
        }
        restore()
        window.addEventListener('popstate', restore)
        return () => {
            window.removeEventListener('popstate', restore)
            if (copyTimer.current) clearTimeout(copyTimer.current)
        }
    }, [])

    useEffect(() => {
        setCopied(false)
        setCopyFailed(false)
    }, [selectedId, seed])

    useEffect(() => {
        if (searchOpen) searchRef.current?.focus()
    }, [searchOpen])

    const flow = WORKFLOWS[activeFlow] ?? WORKFLOWS[0]
    const flowTools = useMemo(() => {
        const ids = seed ? seededShuffle(flow.toolIds, seedToNumber(seed)) : flow.toolIds
        return ids.map((id) => TOOLS.find((tool) => tool.id === id)).filter((tool): tool is Tool => Boolean(tool))
    }, [flow, seed])
    const selected = flowTools.find((tool) => tool.id === selectedId) ?? flowTools[0]
    const selectedIndex = selected ? flowTools.findIndex((tool) => tool.id === selected.id) : -1
    const searchResults = useMemo(() => filterTools(TOOLS, 'all', query).slice(0, 6), [query])

    const onExplorerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const target = event.target as HTMLElement
        if (
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            target.isContentEditable ||
            target.closest('input,textarea,select')
        )
            return
        if (event.key === 'ArrowRight') {
            event.preventDefault()
            moveTool(1)
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault()
            moveTool(-1)
        } else if (event.key === 'ArrowDown') {
            event.preventDefault()
            selectFlow(Math.min(activeFlow + 1, WORKFLOWS.length - 1))
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            selectFlow(Math.max(activeFlow - 1, 0))
        } else if (event.key === 'Home') {
            event.preventDefault()
            const first = flowTools[0]
            if (first) selectTool(first)
        } else if (event.key === 'End') {
            event.preventDefault()
            const last = flowTools.at(-1)
            if (last) selectTool(last)
        }
    }

    const selectFlow = (index: number) => {
        const next = WORKFLOWS[index]
        if (!next) return
        setActiveFlow(index)
        const first = seed ? seededShuffle(next.toolIds, seedToNumber(seed))[0] : next.toolIds[0]
        if (first) setSelectedId(first)
    }

    const moveTool = (direction: number) => {
        if (!selected || flowTools.length === 0) return
        const next = (selectedIndex + direction + flowTools.length) % flowTools.length
        const tool = flowTools[next]
        if (tool) setSelectedId(tool.id)
    }

    const selectTool = (tool: Tool) => {
        setSelectedId(tool.id)
        setActiveFlow(toolWorkflowIndex(tool.id))
        setSearchOpen(false)
        setQuery('')
        document.querySelector('.wayseeker')?.scrollIntoView({
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            block: 'start',
        })
    }

    const shuffle = () => {
        const value = randomSeed()
        const shuffled = seededShuffle(TOOLS, seedToNumber(value))
        if (!shuffled[0]) return
        setSeed(value)
        setSelectedId(shuffled[0].id)
        setActiveFlow(toolWorkflowIndex(shuffled[0].id))
        setCopied(false)
        const url = writeExplorerRoute(window.location.href, { seed: value, tool: shuffled[0].id })
        window.history.replaceState(null, '', url)
    }

    const copyPath = async () => {
        const href = writeExplorerRoute(window.location.href, { seed, tool: selected?.id ?? null }).href
        window.history.replaceState(window.history.state, '', href)
        try {
            await navigator.clipboard.writeText(href)
            setCopied(true)
            if (copyTimer.current) clearTimeout(copyTimer.current)
            copyTimer.current = setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopyFailed(true)
        }
    }

    if (!flow || !selected) return null

    const text = {
        question: isReady ? t('wayseeker.question') : 'What are you making?',
        index: isReady ? t('wayseeker.index') : 'Index',
        search: isReady ? t('toolsWall.searchAriaLabel') : 'Search tools',
        next: isReady ? t('wayseeker.next') : 'Next stop',
        previous: isReady ? t('wayseeker.previous') : 'Previous stop',
        shuffle: isReady ? t('wayseeker.shuffle') : 'Surprise me',
        copied: isReady ? t('toolsWall.linkCopied') : 'Copied',
        copy: isReady ? t('wayseeker.copy') : 'Copy this path',
        clear: isReady ? t('wayseeker.clear') : 'Back to the curated route',
        results: isReady ? t('wayseeker.results') : 'Matching tools',
    }

    return (
        <div className="wayseeker-shell">
            <section className="wayseeker-intro container max-w-7xl mx-auto px-4" aria-labelledby="wayseeker-title">
                <h1 id="wayseeker-title">{text.question}</h1>
                <p>{isReady ? t('wayseeker.intro') : 'A field guide for the next thing you need to make.'}</p>
            </section>

            <section
                className="wayseeker"
                aria-label={isReady ? t('wayseeker.mapLabel') : 'Workflow explorer'}
                onKeyDown={onExplorerKeyDown}
            >
                <div className="wayseeker-route-wrap container max-w-7xl mx-auto px-4">
                    <nav
                        className="wayseeker-route"
                        aria-label={isReady ? t('wayseeker.routeLabel') : 'Choose a workflow'}
                    >
                        {WORKFLOWS.map((item, index) => (
                            <button
                                type="button"
                                key={item.id}
                                className={`wayseeker-stop${index === activeFlow ? ' is-active' : ''}`}
                                aria-pressed={index === activeFlow}
                                onClick={() => selectFlow(index)}
                            >
                                <span className="wayseeker-stop-dot" aria-hidden="true" />
                                <span>{item.name[lang]}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="wayseeker-stage container max-w-7xl mx-auto px-4">
                    <div className="wayseeker-scene-heading">
                        <p>{flow.question[lang]}</p>
                    </div>

                    <AtlasScene
                        key={selected.id}
                        tool={selected}
                        tools={flowTools}
                        index={selectedIndex}
                        onSelect={selectTool}
                    />

                    <div className="wayseeker-scene-footer">
                        <p>{flow.description[lang]}</p>
                        <div className="wayseeker-step-controls">
                            <button type="button" onClick={() => moveTool(-1)} aria-label={text.previous}>
                                <ArrowLeftIcon weight="regular" />
                            </button>
                            <span>
                                {String(selectedIndex + 1).padStart(2, '0')} /{' '}
                                {String(flowTools.length).padStart(2, '0')}
                            </span>
                            <button type="button" onClick={() => moveTool(1)} aria-label={text.next}>
                                <ArrowRightIcon weight="regular" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="wayseeker-actions container max-w-7xl mx-auto px-4"
                aria-label={isReady ? t('wayseeker.exploreActions') : 'Explore actions'}
            >
                <button type="button" className="wayseeker-shuffle" onClick={shuffle}>
                    <ShuffleIcon weight="bold" /> {text.shuffle}
                </button>
                <button
                    ref={indexRef}
                    type="button"
                    onClick={() => setSearchOpen((value) => !value)}
                    aria-expanded={searchOpen}
                    aria-controls="tool-search"
                >
                    <MagnifyingGlassIcon weight="regular" /> {text.index}
                </button>
                {seed && (
                    <>
                        <button type="button" onClick={copyPath}>
                            {copied ? text.copied : text.copy}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSeed(null)
                                const url = new URL(window.location.href)
                                url.searchParams.delete('seed')
                                url.searchParams.delete('tool')
                                window.history.replaceState(null, '', url)
                            }}
                            aria-label={text.clear}
                        >
                            <XIcon weight="bold" />
                        </button>
                    </>
                )}
                {copyFailed && (
                    <p role="status">{isReady ? t('wayseeker.copyFailed') : 'Copy the path from your address bar.'}</p>
                )}
                <a
                    href="#workflow-notes"
                    className="wayseeker-down"
                    aria-label={isReady ? t('wayseeker.more') : 'More about the guide'}
                >
                    <ArrowDownIcon weight="regular" />
                </a>
            </section>

            {searchOpen && (
                <section
                    id="tool-search"
                    className="wayseeker-search container max-w-7xl mx-auto px-4"
                    aria-label={text.search}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            event.preventDefault()
                            setSearchOpen(false)
                            indexRef.current?.focus()
                        }
                    }}
                >
                    <div className="wayseeker-search-field">
                        <MagnifyingGlassIcon weight="regular" />
                        <input
                            ref={searchRef}
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={isReady ? t('toolsWall.searchPlaceholder') : 'Search tools, notes, domains…'}
                            aria-label={text.search}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('')
                                setSearchOpen(false)
                                indexRef.current?.focus()
                            }}
                            aria-label={isReady ? t('toolsWall.clearSearch') : 'Clear search'}
                        >
                            <XIcon weight="regular" />
                        </button>
                    </div>
                    {query && (
                        <div className="wayseeker-search-results">
                            <h2>{text.results}</h2>
                            {searchResults.length > 0 ? (
                                searchResults.map((tool) => (
                                    <button type="button" key={tool.id} onClick={() => selectTool(tool)}>
                                        <span>{tool.name[lang] || tool.name.en}</span>
                                        <span>{getDomain(tool.url)}</span>
                                        <ArrowRightIcon weight="regular" />
                                    </button>
                                ))
                            ) : (
                                <p>{isReady ? t('toolsWall.noResultsHint') : 'Try another keyword.'}</p>
                            )}
                        </div>
                    )}
                </section>
            )}

            <section id="workflow-notes" className="wayseeker-explanation container max-w-7xl mx-auto px-4">
                <div>
                    <h2>{isReady ? t('wayseeker.explainTitle') : 'A guide, not a leaderboard.'}</h2>
                    <p>
                        {isReady
                            ? t('wayseeker.explainBody')
                            : 'Every tool is here for a reason. Follow a workflow to see how tools relate, or search the index when you already know what you need.'}
                    </p>
                </div>
                <div className="wayseeker-explanation-note">
                    <span>{isReady ? t('wayseeker.explainNote') : 'Notes from real use'}</span>
                    <p>
                        {isReady
                            ? t('wayseeker.explainNoteBody')
                            : 'When to reach for a tool, what it can replace, and the thing worth knowing before you commit.'}
                    </p>
                </div>
            </section>

            <section
                className="wayseeker-all-tools container max-w-7xl mx-auto px-4"
                aria-label={isReady ? t('wayseeker.allTools') : 'All tools'}
            >
                <h2>{isReady ? t('wayseeker.allTools') : 'Every tool, in context.'}</h2>
                <div className="wayseeker-index-grid">
                    {WORKFLOWS.map((item) => (
                        <section key={item.id} aria-labelledby={`workflow-${item.id}`}>
                            <h3 id={`workflow-${item.id}`}>{item.name[lang]}</h3>
                            <ul>
                                {item.toolIds.map((id) => {
                                    const tool = TOOLS.find((entry) => entry.id === id)
                                    if (!tool) return null
                                    return (
                                        <li key={id}>
                                            <button type="button" onClick={() => selectTool(tool)}>
                                                {tool.name[lang] || tool.name.en}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </section>
                    ))}
                </div>
            </section>
        </div>
    )
}
