'use client'

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowSquareOutIcon,
    ArrowsClockwiseIcon,
    LinkIcon,
    MagnifyingGlassIcon,
    XIcon,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DrawerFront, EmptyDrawer } from '@/components/DrawerFront'
import { normalizeLanguage } from '@/components/I18nProvider'
import { LabelRows } from '@/components/LabelRows'
import { ToolPreviewImage } from '@/components/ToolPreviewImage'
import TOOLS from '@/data/tools'
import { WORKFLOWS } from '@/data/workflow'
import { useI18nReady } from '@/hooks/useI18nReady'
import { CABINET_ROWS, DRAWERS, type Drawer, drawerOf, drawersInStage, habitOf, stageLetter } from '@/lib/drawers'
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
import { randomSeed } from '@/lib/shuffle'

const DEFAULT_TOOL = 'timing'

function reducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Dispensary() {
    const { i18n, t } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)

    const [selectedId, setSelectedId] = useState(DEFAULT_TOOL)
    const [stageFilter, setStageFilter] = useState<number | null>(null)
    const [query, setQuery] = useState('')
    const [planSeed, setPlanSeed] = useState<string | null>(null)
    const [picks, setPicks] = useState<Array<string | null>>([])
    const [flash, setFlash] = useState<string | null>(null)
    const [failed, setFailed] = useState(false)
    const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const counterRef = useRef<HTMLElement>(null)
    const rxRef = useRef<HTMLElement>(null)

    // Restore shared state (?tool, ?plan, ?p; legacy ?seed is ignored) on load and history moves.
    useEffect(() => {
        const restore = () => {
            const route = readExplorerRoute(
                window.location.search,
                TOOLS.map((tool) => tool.id),
            )
            if (route.tool) setSelectedId(route.tool)
            setPlanSeed(route.plan)
            setPicks(route.plan && route.picks ? [...parsePlanPicks(route.picks)] : [])
            if (route.plan) {
                requestAnimationFrame(() =>
                    rxRef.current?.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth' }),
                )
            }
        }
        restore()
        window.addEventListener('popstate', restore)
        return () => {
            window.removeEventListener('popstate', restore)
            if (flashTimer.current) clearTimeout(flashTimer.current)
        }
    }, [])

    const selected = drawerOf(selectedId) ?? DRAWERS[0]
    const stageDrawers = useMemo(() => drawersInStage(selected.stage), [selected.stage])
    const at = stageDrawers.findIndex((drawer) => drawer.tool.id === selected.tool.id)

    const matches = useMemo(() => {
        if (!query.trim()) return null
        const ids = new Set(filterTools(TOOLS, 'all', query).map((tool) => tool.id))
        // Habits are part of what a visitor searches for.
        for (const drawer of DRAWERS) {
            const q = query.toLowerCase().trim()
            if (habitOf(drawer.tool, 'en').toLowerCase().includes(q) || habitOf(drawer.tool, 'zh').includes(q))
                ids.add(drawer.tool.id)
        }
        return ids
    }, [query])

    const plan = useMemo(() => (planSeed ? generatePlan(planSeed, picks) : null), [planSeed, picks])

    const say = (key: string) => {
        setFlash(key)
        setFailed(false)
        if (flashTimer.current) clearTimeout(flashTimer.current)
        flashTimer.current = setTimeout(() => setFlash(null), 2000)
    }

    const writeUrl = (next: { tool?: string | null; plan?: string | null; picks?: Array<string | null> }) => {
        const nextPlan = next.plan !== undefined ? next.plan : planSeed
        const nextPicks = next.picks ?? picks
        const url = writeExplorerRoute(window.location.href, {
            seed: null,
            tool: next.tool !== undefined ? next.tool : selected.tool.id,
            plan: nextPlan,
            picks: nextPlan && hasPicks(nextPicks) ? encodePlanPicks(nextPicks) : null,
        })
        window.history.replaceState(window.history.state, '', url)
        return url
    }

    const select = (drawer: Drawer, options: { reveal?: boolean } = {}) => {
        setSelectedId(drawer.tool.id)
        setFlash(null)
        writeUrl({ tool: drawer.tool.id })
        if (options.reveal && counterRef.current) {
            const rect = counterRef.current.getBoundingClientRect()
            if (rect.top < 0 || rect.top > window.innerHeight * 0.6) {
                counterRef.current.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' })
            }
        }
    }

    const step = (delta: number) => {
        if (stageDrawers.length === 0) return
        const next = stageDrawers[(at + delta + stageDrawers.length) % stageDrawers.length]
        if (next) select(next)
    }

    const pickStage = (stage: number | null) => {
        setStageFilter(stage)
        if (stage === null) return
        const first = drawersInStage(stage)[0]
        if (first) select(first)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const target = event.target as HTMLElement
        if (event.altKey || event.ctrlKey || event.metaKey || target.closest('input,textarea,select')) return
        let handled = true
        if (event.key === 'ArrowRight') step(1)
        else if (event.key === 'ArrowLeft') step(-1)
        else if (event.key === 'ArrowDown') pickStage(Math.min(selected.stage + 1, WORKFLOWS.length - 1))
        else if (event.key === 'ArrowUp') pickStage(Math.max(selected.stage - 1, 0))
        else if (event.key === 'Home' && stageDrawers[0]) select(stageDrawers[0])
        else if (event.key === 'End' && stageDrawers.length > 0) select(stageDrawers[stageDrawers.length - 1])
        else handled = false
        if (handled) event.preventDefault()
    }

    const copy = async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(text)
            say(key)
        } catch {
            setFailed(true)
        }
    }

    const planTitle = (anchorName: string, key: string) => t(`plan.titles.${key}`, { name: anchorName })

    const writePlan = () => {
        const value = randomSeed()
        setPlanSeed(value)
        setPicks([])
        writeUrl({ plan: value, picks: [] })
    }

    const swap = (index: number) => {
        if (!plan || !planSeed) return
        const current = plan.steps[index]
        if (!current) return
        const nextId = rerollStep(planSeed, index, current.tool.id)
        const next = WORKFLOWS.map((_, i) => (i === index ? nextId : (picks[i] ?? null)))
        setPicks(next)
        writeUrl({ picks: next })
    }

    const planHref = () =>
        writeExplorerRoute(window.location.href, {
            seed: null,
            tool: null,
            plan: planSeed,
            picks: planSeed && hasPicks(picks) ? encodePlanPicks(picks) : null,
        }).href

    const copyPlan = () => {
        if (!plan) return
        const title = planTitle(plan.anchor.name[lang] || plan.anchor.name.en, planTitleKey(plan.anchor))
        return copy(planToMarkdown(plan, { lang, title, shareHref: planHref() }), 'plan')
    }

    const tool = selected.tool
    const name = tool.name[lang] || tool.name.en
    const domain = getDomain(tool.url)

    return (
        <div onKeyDown={onKeyDown}>
            {/* ── First viewport: the habits, and the label that answers one ── */}
            <section className="hero" aria-labelledby="hero-title">
                <div className="wrap hero-grid">
                    <div>
                        <h1 id="hero-title" className="display hero-title">
                            {t('hero.title')}
                        </h1>
                        <p className="hero-lede">{t('hero.lede', { count: TOOLS.length })}</p>

                        <div className="stage-tabs" role="group" aria-label={t('hero.stagesLabel')}>
                            {WORKFLOWS.map((flow, index) => (
                                <button
                                    type="button"
                                    key={flow.id}
                                    className="stage-tab"
                                    aria-pressed={stageFilter === index}
                                    onClick={() => pickStage(stageFilter === index ? null : index)}
                                >
                                    <span className="code">{stageLetter(index)}</span>
                                    <span className="caps">{flow.name[lang]}</span>
                                </button>
                            ))}
                        </div>

                        <ul className="habit-field" aria-label={t('hero.fieldLabel')}>
                            {DRAWERS.map((drawer) => {
                                const current = drawer.tool.id === tool.id
                                const dim = stageFilter !== null && drawer.stage !== stageFilter
                                return (
                                    <li key={drawer.tool.id}>
                                        <button
                                            type="button"
                                            className={`habit${dim ? ' is-dim' : ''}`}
                                            aria-pressed={current}
                                            onClick={() => select(drawer, { reveal: true })}
                                        >
                                            <span className="habit-text">{habitOf(drawer.tool, lang)}</span>
                                            <span className="habit-code">{drawer.code}</span>
                                            <span className="habit-sep" aria-hidden="true">
                                                /
                                            </span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>

                        <p className="hero-keys code" aria-hidden="true">
                            <span>
                                <kbd>←</kbd>
                                <kbd>→</kbd>
                                {t('hero.keys')}
                            </span>
                            <span>
                                <kbd>↑</kbd>
                                <kbd>↓</kbd>
                                {t('hero.keysColumn')}
                            </span>
                        </p>
                    </div>

                    <aside
                        ref={counterRef}
                        className="counter"
                        aria-label={t('counter.label')}
                        aria-live="polite"
                        aria-atomic="false"
                    >
                        <div className="counter-head">
                            <span className="counter-code">{t('counter.drawer', { code: selected.code })}</span>
                            <span className="caps">{WORKFLOWS[selected.stage]?.name[lang]}</span>
                            <span className="counter-pos">
                                {t('counter.of', { at: at + 1, total: stageDrawers.length })}
                            </span>
                        </div>
                        <div className="counter-slot">
                            <article key={tool.id} className="slip">
                                <div className="slip-shot">
                                    <ToolPreviewImage
                                        tool={tool}
                                        eager
                                        sizes="(min-width: 1024px) 560px, 100vw"
                                        alt={t('counter.previewAlt', { name })}
                                    />
                                </div>
                                <div className="slip-body">
                                    <div className="slip-title-row">
                                        <h2 className="display slip-name">{name}</h2>
                                        <span className="slip-domain code">{domain}</span>
                                    </div>
                                    <p className="slip-desc">{tool.description[lang]}</p>
                                    <LabelRows tool={tool} lang={lang} />
                                </div>
                            </article>
                        </div>
                        <div className="counter-actions">
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => step(-1)}
                                aria-label={t('counter.previous')}
                            >
                                <ArrowLeftIcon weight="bold" />
                            </button>
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => step(1)}
                                aria-label={t('counter.next')}
                            >
                                <ArrowRightIcon weight="bold" />
                            </button>
                            <span className="spacer" />
                            <Link href={`/t/${tool.id}`} className="btn btn--quiet">
                                {t('counter.fullLabel')}
                            </Link>
                            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn--brass">
                                {t('counter.visit')}
                                <ArrowSquareOutIcon weight="bold" />
                                <span className="sr-only">({t('counter.opensInNewTab')})</span>
                            </a>
                        </div>
                    </aside>
                </div>
            </section>

            {/* ── The cabinet: every drawer, by stage ── */}
            <section id="cabinet" className="cabinet" aria-labelledby="cabinet-title">
                <div className="wrap">
                    <div className="cabinet-head">
                        <div>
                            <h2 id="cabinet-title" className="display cabinet-title">
                                {t('cabinet.title')}
                            </h2>
                            <p className="cabinet-lede">{t('cabinet.lede', { count: TOOLS.length })}</p>
                        </div>
                        <div className="cabinet-search">
                            <label htmlFor="drawer-search" className="caps">
                                {t('cabinet.search')}
                            </label>
                            <div className="search-field">
                                <MagnifyingGlassIcon weight="bold" />
                                <input
                                    id="drawer-search"
                                    type="search"
                                    value={query}
                                    placeholder={t('cabinet.searchPlaceholder')}
                                    onChange={(event) => setQuery(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Escape') setQuery('')
                                    }}
                                />
                                {query && (
                                    <button
                                        type="button"
                                        className="chrome-btn"
                                        onClick={() => setQuery('')}
                                        aria-label={t('cabinet.clearSearch')}
                                    >
                                        <XIcon weight="bold" />
                                    </button>
                                )}
                            </div>
                            <p className="cabinet-count" role="status">
                                {matches
                                    ? matches.size > 0
                                        ? t('cabinet.matches', { count: matches.size })
                                        : t('cabinet.noMatches')
                                    : ''}
                            </p>
                        </div>
                    </div>

                    <div className="cabinet-frame">
                        {WORKFLOWS.map((flow, stage) => {
                            const column = drawersInStage(stage)
                            return (
                                <section key={flow.id} className="cabinet-col" aria-labelledby={`col-${flow.id}`}>
                                    <header className="col-head">
                                        <span className="col-letter" aria-hidden="true">
                                            {stageLetter(stage)}
                                        </span>
                                        <h3 id={`col-${flow.id}`} className="col-name">
                                            {flow.name[lang]}
                                        </h3>
                                        <p className="col-question">{flow.question[lang]}</p>
                                    </header>
                                    <ul className="drawers">
                                        {Array.from({ length: CABINET_ROWS }, (_, row) => {
                                            const drawer = column[row]
                                            return (
                                                <li key={drawer?.tool.id ?? `empty-${row}`}>
                                                    {drawer ? (
                                                        <DrawerFront
                                                            drawer={drawer}
                                                            lang={lang}
                                                            current={drawer.tool.id === tool.id}
                                                            dim={matches !== null && !matches.has(drawer.tool.id)}
                                                            onSelect={(d) => select(d, { reveal: true })}
                                                        />
                                                    ) : (
                                                        <EmptyDrawer label={t('cabinet.empty')} />
                                                    )}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </section>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── The prescription: one drawer per column ── */}
            <section id="prescription" ref={rxRef} className="rx" aria-labelledby="rx-title">
                <div className="wrap rx-grid">
                    <div className="rx-intro">
                        <h2 id="rx-title" className="display rx-title">
                            {t('plan.title')}
                        </h2>
                        <p className="rx-lede">{t('plan.lede')}</p>
                        <div className="rx-intro-actions">
                            <button type="button" className="btn btn--ink" onClick={writePlan}>
                                {plan ? <ArrowsClockwiseIcon weight="bold" /> : null}
                                {plan ? t('plan.rewrite') : t('plan.write')}
                            </button>
                        </div>
                    </div>

                    <section className="rx-slip" aria-label={t('plan.label')}>
                        <div className="rx-head">
                            <span className="rx-mark" aria-hidden="true">
                                Rx
                            </span>
                            <span className="caps">Wayseeker</span>
                            <span className="rx-meta code">
                                {t('plan.number')} {planSeed ?? '——————'}
                            </span>
                        </div>

                        {plan ? (
                            <>
                                <h3 className="display rx-plan-title">
                                    {planTitle(
                                        plan.anchor.name[lang] || plan.anchor.name.en,
                                        planTitleKey(plan.anchor),
                                    )}
                                </h3>
                                <ol className="rx-lines">
                                    {plan.steps.map((line, index) => {
                                        const flow = WORKFLOWS[index]
                                        const toolName = line.tool.name[lang] || line.tool.name.en
                                        return (
                                            <li
                                                key={line.workflowId}
                                                className={`rx-line${line.tool.id === plan.anchor.id ? ' is-anchor' : ''}`}
                                            >
                                                <span
                                                    className="rx-letter"
                                                    title={
                                                        line.tool.id === plan.anchor.id ? t('plan.anchor') : undefined
                                                    }
                                                >
                                                    {stageLetter(index)}
                                                </span>
                                                <div key={line.tool.id} className="rx-swap-in min-w-0">
                                                    <span className="rx-stage caps">
                                                        {flow?.name[lang]}
                                                        {line.tool.id === plan.anchor.id
                                                            ? ` · ${t('plan.anchor')}`
                                                            : ''}
                                                        {line.pinned ? ` · ${t('plan.pinned')}` : ''}
                                                    </span>
                                                    <Link href={`/t/${line.tool.id}`} className="rx-name">
                                                        {toolName}
                                                    </Link>
                                                    <span className="rx-instead">
                                                        {t('plan.instead')}{' '}
                                                        <s className="strike">{habitOf(line.tool, lang)}</s>
                                                    </span>
                                                </div>
                                                <div className="rx-line-actions">
                                                    <button
                                                        type="button"
                                                        className="btn btn--quiet"
                                                        onClick={() => swap(index)}
                                                        aria-label={t('plan.swapLabel', { stage: flow?.name[lang] })}
                                                    >
                                                        <ArrowsClockwiseIcon weight="bold" />
                                                        {t('plan.swap')}
                                                    </button>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ol>
                                <div className="rx-foot">
                                    <button type="button" className="btn btn--ink" onClick={copyPlan}>
                                        {flash === 'plan' ? t('plan.copied') : t('plan.copy')}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn--line"
                                        onClick={() => copy(planHref(), 'planLink')}
                                    >
                                        <LinkIcon weight="bold" />
                                        {flash === 'planLink' ? t('plan.linkCopied') : t('plan.copyLink')}
                                    </button>
                                    {failed && (
                                        <p role="status" className="notice">
                                            {t('plan.copyFailed')}
                                        </p>
                                    )}
                                    <span key={planSeed} className="seal" aria-hidden="true">
                                        <span>寻</span>
                                        <span>路</span>
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <ol className="rx-lines">
                                    {WORKFLOWS.map((flow, index) => (
                                        <li key={flow.id} className="rx-line is-blank">
                                            <span className="rx-letter">{stageLetter(index)}</span>
                                            <div>
                                                <span className="rx-stage caps">{flow.name[lang]}</span>
                                                <div className="rx-blank" />
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                                <div className="rx-foot">
                                    <p className="rx-blank-note">{t('plan.blank')}</p>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </section>
        </div>
    )
}
