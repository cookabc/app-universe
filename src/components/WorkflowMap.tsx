'use client'

import {
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowsClockwiseIcon,
    CompassIcon,
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
import {
    encodePlanPicks,
    generatePlan,
    hasPicks,
    parsePlanPicks,
    planTitleKey,
    planToMarkdown,
    rerollStep,
} from '@/lib/plan'
import { randomSeed, seededShuffle, seedToNumber } from '@/lib/shuffle'

export default function WorkflowMap() {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const [activeFlow, setActiveFlow] = useState(0)
    const [selectedId, setSelectedId] = useState('open-design')
    const [query, setQuery] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [seed, setSeed] = useState<string | null>(null)
    const [planOpen, setPlanOpen] = useState(false)
    const [planSeed, setPlanSeed] = useState<string | null>(null)
    const [picks, setPicks] = useState<Array<string | null>>([])
    const [copied, setCopied] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)
    const indexRef = useRef<HTMLButtonElement>(null)
    const planButtonRef = useRef<HTMLButtonElement>(null)
    const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const planTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [copyFailed, setCopyFailed] = useState(false)
    const [planCopied, setPlanCopied] = useState(false)
    const [planLinkCopied, setPlanLinkCopied] = useState(false)
    const [planCopyFailed, setPlanCopyFailed] = useState(false)

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
            if (route.plan) {
                setPlanSeed(route.plan)
                setPicks(route.picks ? [...parsePlanPicks(route.picks)] : [])
                setPlanOpen(true)
            }
        }
        restore()
        window.addEventListener('popstate', restore)
        return () => {
            window.removeEventListener('popstate', restore)
            if (copyTimer.current) clearTimeout(copyTimer.current)
            if (planTimer.current) clearTimeout(planTimer.current)
        }
    }, [])

    useEffect(() => {
        setCopied(false)
        setCopyFailed(false)
    }, [selectedId, seed])

    useEffect(() => {
        setPlanCopied(false)
        setPlanLinkCopied(false)
        setPlanCopyFailed(false)
    }, [planSeed, picks])

    useEffect(() => {
        if (searchOpen) searchRef.current?.focus()
    }, [searchOpen])

    const planSectionRef = useRef<HTMLElement>(null)
    useEffect(() => {
        if (!planOpen) return
        planSectionRef.current?.scrollIntoView({
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            block: 'start',
        })
    }, [planOpen])

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

    /** Explorer URL state, preserving any generated plan unless overridden. */
    const explorerRoute = (overrides?: { seed?: string | null; tool?: string | null }) => ({
        seed: overrides?.seed !== undefined ? overrides.seed : seed,
        tool: overrides?.tool !== undefined ? overrides.tool : (selected?.id ?? null),
        plan: planSeed,
        picks: planSeed && hasPicks(picks) ? encodePlanPicks(picks) : null,
    })

    const shuffle = () => {
        const value = randomSeed()
        const shuffled = seededShuffle(TOOLS, seedToNumber(value))
        if (!shuffled[0]) return
        setSeed(value)
        setSelectedId(shuffled[0].id)
        setActiveFlow(toolWorkflowIndex(shuffled[0].id))
        setCopied(false)
        const url = writeExplorerRoute(window.location.href, explorerRoute({ seed: value, tool: shuffled[0].id }))
        window.history.replaceState(null, '', url)
    }

    const copyPath = async () => {
        const href = writeExplorerRoute(window.location.href, explorerRoute()).href
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

    const plan = useMemo(() => (planSeed ? generatePlan(planSeed, picks) : null), [planSeed, picks])

    const planTitleFor = (anchor: Tool) =>
        isReady
            ? t(`plan.titles.${planTitleKey(anchor)}`, { name: anchor.name[lang] || anchor.name.en })
            : `A plan starting from ${anchor.name.en}`

    const openPlan = () => {
        if (!planSeed) {
            const value = randomSeed()
            setPlanSeed(value)
            setPicks([])
            window.history.replaceState(
                window.history.state,
                '',
                writeExplorerRoute(window.location.href, {
                    seed,
                    tool: selected?.id ?? null,
                    plan: value,
                    picks: null,
                }),
            )
        }
        setPlanOpen(true)
    }

    const closePlan = () => {
        setPlanOpen(false)
        window.history.replaceState(
            window.history.state,
            '',
            writeExplorerRoute(window.location.href, { seed, tool: selected?.id ?? null, plan: null, picks: null }),
        )
        planButtonRef.current?.focus()
    }

    const newPlan = () => {
        const value = randomSeed()
        setPlanSeed(value)
        setPicks([])
        setPlanCopied(false)
        setPlanLinkCopied(false)
        window.history.replaceState(
            window.history.state,
            '',
            writeExplorerRoute(window.location.href, {
                seed,
                tool: selected?.id ?? null,
                plan: value,
                picks: null,
            }),
        )
    }

    const swapStep = (index: number) => {
        if (!plan || !planSeed) return
        const step = plan.steps[index]
        if (!step) return
        const nextId = rerollStep(planSeed, index, step.tool.id)
        const next = WORKFLOWS.map((_, at) => (at === index ? nextId : (picks[at] ?? null)))
        setPicks(next)
        window.history.replaceState(
            window.history.state,
            '',
            writeExplorerRoute(window.location.href, {
                seed,
                tool: selected?.id ?? null,
                plan: planSeed,
                picks: encodePlanPicks(next),
            }),
        )
    }

    const shareHref = () =>
        writeExplorerRoute(window.location.href, {
            seed,
            tool: selected?.id ?? null,
            plan: planSeed,
            picks: planSeed && hasPicks(picks) ? encodePlanPicks(picks) : null,
        }).href

    const copyPlanMarkdown = async () => {
        if (!plan) return
        try {
            await navigator.clipboard.writeText(
                planToMarkdown(plan, { lang, title: planTitleFor(plan.anchor), shareHref: shareHref() }),
            )
            setPlanCopied(true)
            if (planTimer.current) clearTimeout(planTimer.current)
            planTimer.current = setTimeout(() => setPlanCopied(false), 2000)
        } catch {
            setPlanCopyFailed(true)
        }
    }

    const copyPlanLink = async () => {
        try {
            await navigator.clipboard.writeText(shareHref())
            setPlanLinkCopied(true)
            if (planTimer.current) clearTimeout(planTimer.current)
            planTimer.current = setTimeout(() => setPlanLinkCopied(false), 2000)
        } catch {
            setPlanCopyFailed(true)
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
        plan: isReady
            ? {
                  open: t('plan.open'),
                  label: t('plan.label'),
                  intro: t('plan.intro'),
                  swap: t('plan.swap'),
                  pinned: t('plan.pinned'),
                  detail: t('plan.detail'),
                  regenerate: t('plan.regenerate'),
                  copy: t('plan.copy'),
                  copied: t('plan.copied'),
                  copyLink: t('plan.copyLink'),
                  linkCopied: t('plan.linkCopied'),
                  close: t('plan.close'),
                  copyFailed: t('plan.copyFailed'),
              }
            : {
                  open: 'Make a plan',
                  label: 'Generated plan',
                  intro: 'One tool per stage, picked to share a direction.',
                  swap: 'Swap',
                  pinned: 'picked',
                  detail: 'Detail',
                  regenerate: 'Reroll the whole plan',
                  copy: 'Copy as Markdown',
                  copied: 'Plan copied',
                  copyLink: 'Copy link',
                  linkCopied: 'Link copied',
                  close: 'Close plan',
                  copyFailed: 'Clipboard is unavailable — the plan link is in your address bar.',
              },
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
                    ref={planButtonRef}
                    type="button"
                    className="wayseeker-plan-toggle"
                    onClick={() => (planOpen ? closePlan() : openPlan())}
                    aria-expanded={planOpen}
                    aria-controls="tool-plan"
                >
                    <CompassIcon weight="regular" /> {text.plan.open}
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

            {planOpen && plan && (
                <section
                    ref={planSectionRef}
                    id="tool-plan"
                    className="wayseeker-plan container max-w-7xl mx-auto px-4"
                    aria-label={text.plan.label}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            event.preventDefault()
                            closePlan()
                        }
                    }}
                >
                    <div className="wayseeker-plan-head">
                        <div>
                            <p className="wayseeker-plan-eyebrow">
                                {isReady
                                    ? t('plan.eyebrow', { name: plan.anchor.name[lang] || plan.anchor.name.en })
                                    : `Anchored on ${plan.anchor.name.en}`}
                            </p>
                            <h2>{planTitleFor(plan.anchor)}</h2>
                        </div>
                        <button type="button" onClick={closePlan} aria-label={text.plan.close}>
                            <XIcon weight="regular" />
                        </button>
                    </div>
                    <p className="wayseeker-plan-intro">{text.plan.intro}</p>
                    <ol className="wayseeker-plan-steps">
                        {plan.steps.map((step, index) => {
                            const flowName =
                                WORKFLOWS.find((entry) => entry.id === step.workflowId)?.name[lang] ?? step.workflowId
                            return (
                                <li key={step.workflowId}>
                                    <div className="wayseeker-plan-lead">
                                        <span className="wayseeker-plan-num">{String(index + 1).padStart(2, '0')}</span>
                                        <span className="wayseeker-plan-stage">{flowName}</span>
                                    </div>
                                    <div className="wayseeker-plan-tool">
                                        <button
                                            type="button"
                                            className="wayseeker-plan-name"
                                            onClick={() => selectTool(step.tool)}
                                        >
                                            {step.tool.name[lang] || step.tool.name.en}
                                        </button>
                                        <span>{getDomain(step.tool.url)}</span>
                                        {step.pinned && <em>{text.plan.pinned}</em>}
                                    </div>
                                    <p className="wayseeker-plan-desc">{step.tool.description[lang]}</p>
                                    <div className="wayseeker-plan-step-actions">
                                        <button type="button" onClick={() => swapStep(index)}>
                                            <ArrowsClockwiseIcon weight="regular" /> {text.plan.swap}
                                        </button>
                                        <a href={`/t/${step.tool.id}`}>{text.plan.detail}</a>
                                    </div>
                                </li>
                            )
                        })}
                    </ol>
                    <div className="wayseeker-plan-foot">
                        <button type="button" onClick={newPlan}>
                            <ShuffleIcon weight="regular" /> {text.plan.regenerate}
                        </button>
                        <button type="button" onClick={copyPlanMarkdown}>
                            {planCopied ? text.plan.copied : text.plan.copy}
                        </button>
                        <button type="button" onClick={copyPlanLink}>
                            {planLinkCopied ? text.plan.linkCopied : text.plan.copyLink}
                        </button>
                        {planCopyFailed && <p role="status">{text.plan.copyFailed}</p>}
                    </div>
                </section>
            )}

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
