'use client'

import {
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowSquareOutIcon,
    MagnifyingGlassIcon,
    ShuffleIcon,
    XIcon,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { normalizeLanguage } from '@/components/I18nProvider'
import { ToolPreviewImage } from '@/components/ToolPreviewImage'
import TOOLS, { getToolPath, type Tool } from '@/data/tools'
import { toolWorkflowIndex, WORKFLOWS } from '@/data/workflow'
import { useI18nReady } from '@/hooks/useI18nReady'
import { parseVerdict } from '@/lib/curator-note'
import { filterTools, getDomain } from '@/lib/filter-tools'
import { parseSeed, randomSeed, seededShuffle, seedToNumber } from '@/lib/shuffle'

function noteMove(note: string | undefined, lang: 'en' | 'zh', key: 'when' | 'replaces' | 'caveat') {
    if (!note) return ''
    const text = parseVerdict(note, lang)?.[key] ?? note
    if (lang === 'zh') return text.replace(/^注意[：:]\s*/, '')
    return text.replace(/^(When |Replaces |Caveat:)\s*/i, '')
}

export default function WorkflowMap() {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const [activeFlow, setActiveFlow] = useState(0)
    const [selectedId, setSelectedId] = useState('open-design')
    const [query, setQuery] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [seed, setSeed] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [transitionKey, setTransitionKey] = useState(0)
    const searchRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const value = new URLSearchParams(window.location.search).get('seed')
        if (parseSeed(value) === null || !value) return
        const shuffled = seededShuffle(TOOLS, seedToNumber(value))
        if (!shuffled[0]) return
        setSeed(value)
        setSelectedId(shuffled[0].id)
        setActiveFlow(toolWorkflowIndex(shuffled[0].id))
    }, [])

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
    const note = selected?.note?.[lang] || selected?.note?.en

    const onExplorerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
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
        setTransitionKey((value) => value + 1)
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
        setTransitionKey((value) => value + 1)
        setSearchOpen(false)
        setQuery('')
        document.querySelector('.wayfinder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const shuffle = () => {
        const value = randomSeed()
        const shuffled = seededShuffle(TOOLS, seedToNumber(value))
        if (!shuffled[0]) return
        setSeed(value)
        setSelectedId(shuffled[0].id)
        setActiveFlow(toolWorkflowIndex(shuffled[0].id))
        setTransitionKey((current) => current + 1)
        setCopied(false)
        const url = new URL(window.location.href)
        url.searchParams.set('seed', value)
        window.history.replaceState(null, '', url)
    }

    const copyPath = async () => {
        if (!seed) return
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // The seed remains in the URL for browsers without clipboard access.
        }
    }

    if (!flow || !selected) return null

    const text = {
        question: isReady ? t('wayfinder.question') : 'What are you making?',
        index: isReady ? t('wayfinder.index') : 'Index',
        search: isReady ? t('toolsWall.searchAriaLabel') : 'Search tools',
        next: isReady ? t('wayfinder.next') : 'Next stop',
        previous: isReady ? t('wayfinder.previous') : 'Previous stop',
        open: isReady ? t('toolDetail.openSite') : 'Open site',
        detail: isReady ? t('toolsWall.details') : 'Details',
        shuffle: isReady ? t('wayfinder.shuffle') : 'Surprise me',
        copied: isReady ? t('toolsWall.linkCopied') : 'Copied',
        copy: isReady ? t('wayfinder.copy') : 'Copy this path',
        clear: isReady ? t('wayfinder.clear') : 'Back to the curated route',
        results: isReady ? t('wayfinder.results') : 'Matching tools',
    }

    return (
        <div className="wayfinder-shell">
            <section className="wayfinder-intro container max-w-7xl mx-auto px-4" aria-labelledby="wayfinder-title">
                <h1 id="wayfinder-title">{text.question}</h1>
                <p>{isReady ? t('wayfinder.intro') : 'A field guide for the next thing you need to make.'}</p>
            </section>

            <section
                className="wayfinder"
                aria-label={isReady ? t('wayfinder.mapLabel') : 'Workflow explorer'}
                onKeyDown={onExplorerKeyDown}
            >
                <div className="wayfinder-route-wrap container max-w-7xl mx-auto px-4">
                    <nav
                        className="wayfinder-route"
                        aria-label={isReady ? t('wayfinder.routeLabel') : 'Choose a workflow'}
                    >
                        {WORKFLOWS.map((item, index) => (
                            <button
                                type="button"
                                key={item.id}
                                className={`wayfinder-stop${index === activeFlow ? ' is-active' : ''}`}
                                aria-pressed={index === activeFlow}
                                onClick={() => selectFlow(index)}
                            >
                                <span className="wayfinder-stop-dot" aria-hidden="true" />
                                <span>{item.name[lang]}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="wayfinder-stage container max-w-7xl mx-auto px-4">
                    <div className="wayfinder-scene-heading">
                        <p>{flow.question[lang]}</p>
                        <span>{selected.name[lang] || selected.name.en}</span>
                    </div>

                    <div className="wayfinder-scene">
                        <div className="wayfinder-preview" key={selected.id} data-transition={transitionKey}>
                            <Link
                                href={getToolPath(selected.id)}
                                aria-label={`${text.detail}: ${selected.name[lang] || selected.name.en}`}
                            >
                                <ToolPreviewImage tool={selected} sizes="(min-width: 900px) 66vw, 100vw" eager />
                            </Link>
                            <span className="wayfinder-preview-marker" aria-hidden="true">
                                {String(selectedIndex + 1).padStart(2, '0')}
                            </span>
                        </div>

                        <aside
                            className="wayfinder-notes"
                            aria-label={isReady ? t('wayfinder.judgment') : 'Curator judgment'}
                        >
                            <div className="wayfinder-tool-heading">
                                <div>
                                    <h2>{selected.name[lang] || selected.name.en}</h2>
                                    <p>{getDomain(selected.url)}</p>
                                </div>
                                <a
                                    href={selected.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${text.open}: ${selected.name[lang] || selected.name.en}`}
                                >
                                    <ArrowSquareOutIcon weight="bold" />
                                </a>
                            </div>
                            <p className="wayfinder-description">
                                {selected.description[lang] || selected.description.en}
                            </p>
                            {note && (
                                <dl className="wayfinder-verdict">
                                    <div>
                                        <dt>{isReady ? t('verdict.when') : 'When to use it'}</dt>
                                        <dd>{noteMove(note, lang, 'when')}</dd>
                                    </div>
                                    <div>
                                        <dt>{isReady ? t('verdict.replaces') : 'What it replaces'}</dt>
                                        <dd>{noteMove(note, lang, 'replaces')}</dd>
                                    </div>
                                    <div>
                                        <dt>{isReady ? t('verdict.caveat') : 'Worth knowing'}</dt>
                                        <dd>{noteMove(note, lang, 'caveat')}</dd>
                                    </div>
                                </dl>
                            )}
                            <Link href={getToolPath(selected.id)} className="wayfinder-detail-link">
                                {text.detail} <ArrowSquareOutIcon weight="regular" />
                            </Link>
                        </aside>
                    </div>

                    <div
                        className="wayfinder-related"
                        role="group"
                        aria-label={isReady ? t('wayfinder.related') : 'Related tools'}
                    >
                        <span className="wayfinder-related-label" aria-hidden="true">
                            {isReady ? t('wayfinder.related') : 'Related tools'}
                        </span>
                        <div className="wayfinder-related-track">
                            {flowTools.map((tool) => (
                                <button
                                    type="button"
                                    key={tool.id}
                                    className={`wayfinder-thumbnail${tool.id === selected.id ? ' is-current' : ''}`}
                                    onClick={() => selectTool(tool)}
                                    aria-pressed={tool.id === selected.id}
                                    aria-label={`${text.next}: ${tool.name[lang] || tool.name.en}`}
                                >
                                    <span className="wayfinder-thumbnail-image">
                                        <ToolPreviewImage tool={tool} sizes="112px" />
                                    </span>
                                    <span className="wayfinder-thumbnail-caption">
                                        {tool.name[lang] || tool.name.en}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="wayfinder-scene-footer">
                        <p>{flow.description[lang]}</p>
                        <div className="wayfinder-step-controls">
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
                className="wayfinder-actions container max-w-7xl mx-auto px-4"
                aria-label={isReady ? t('wayfinder.exploreActions') : 'Explore actions'}
            >
                <button type="button" className="wayfinder-shuffle" onClick={shuffle}>
                    <ShuffleIcon weight="bold" /> {text.shuffle}
                </button>
                <button
                    type="button"
                    className="wayfinder-search-toggle"
                    onClick={() => setSearchOpen((value) => !value)}
                    aria-expanded={searchOpen}
                >
                    <MagnifyingGlassIcon weight="regular" /> {text.index}
                </button>
                {seed && (
                    <>
                        <button type="button" onClick={copyPath} className="wayfinder-copy">
                            {copied ? text.copied : text.copy}
                        </button>
                        <button
                            type="button"
                            className="wayfinder-clear"
                            onClick={() => {
                                setSeed(null)
                                const url = new URL(window.location.href)
                                url.searchParams.delete('seed')
                                window.history.replaceState(null, '', url)
                            }}
                            aria-label={text.clear}
                        >
                            <XIcon weight="bold" />
                        </button>
                    </>
                )}
                <a
                    href="#workflow-notes"
                    className="wayfinder-down"
                    aria-label={isReady ? t('wayfinder.more') : 'More about the guide'}
                >
                    <ArrowDownIcon weight="regular" />
                </a>
            </section>

            {searchOpen && (
                <section className="wayfinder-search container max-w-7xl mx-auto px-4" aria-label={text.search}>
                    <div className="wayfinder-search-field">
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
                            }}
                            aria-label={isReady ? t('toolsWall.clearSearch') : 'Clear search'}
                        >
                            <XIcon weight="regular" />
                        </button>
                    </div>
                    {query && (
                        <div className="wayfinder-search-results">
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

            <section id="workflow-notes" className="wayfinder-explanation container max-w-7xl mx-auto px-4">
                <div>
                    <h2>{isReady ? t('wayfinder.explainTitle') : 'A guide, not a leaderboard.'}</h2>
                    <p>
                        {isReady
                            ? t('wayfinder.explainBody')
                            : 'Every tool is here for a reason. Follow a workflow to see how tools relate, or search the index when you already know what you need.'}
                    </p>
                </div>
                <div className="wayfinder-explanation-note">
                    <span>{isReady ? t('wayfinder.explainNote') : 'Notes from real use'}</span>
                    <p>
                        {isReady
                            ? t('wayfinder.explainNoteBody')
                            : 'When to reach for a tool, what it can replace, and the thing worth knowing before you commit.'}
                    </p>
                </div>
            </section>

            <section
                className="wayfinder-all-tools container max-w-7xl mx-auto px-4"
                aria-label={isReady ? t('wayfinder.allTools') : 'All tools'}
            >
                <h2>{isReady ? t('wayfinder.allTools') : 'Every tool, in context.'}</h2>
                <div className="wayfinder-index-grid">
                    {WORKFLOWS.map((item, index) => (
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
                            <span className="sr-only">{index + 1}</span>
                        </section>
                    ))}
                </div>
            </section>
        </div>
    )
}
