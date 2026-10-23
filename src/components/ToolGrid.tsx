'use client'

import { ArrowRightIcon, ArrowSquareOutIcon, ShuffleIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { normalizeLanguage } from '@/components/I18nProvider'
import { ToolPreviewImage } from '@/components/ToolPreviewImage'
import tools, { CATEGORY_LABELS, CATEGORY_ORDER, getAllTags, getToolPath } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { useTagLabel } from '@/hooks/useTagLabel'
import { filterTools, getDomain } from '@/lib/filter-tools'
import { parseSeed, randomSeed, seededShuffle, seedToNumber } from '@/lib/shuffle'

export function ToolGrid() {
    const { i18n } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const zh = lang === 'zh'
    const tagLabel = useTagLabel()
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('all')
    const [tag, setTag] = useState('all')
    const [selected, setSelected] = useState('')
    const [seed, setSeed] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const nextQuery = params.get('q')
        if (nextQuery) setQuery(nextQuery)
        const nextCategory = params.get('category')
        if (nextCategory && CATEGORY_ORDER.some((value) => value === nextCategory)) setCategory(nextCategory)
        const nextTag = params.get('tag')
        if (nextTag && tools.some((tool) => tool.tags.includes(nextTag))) setTag(nextTag)
        const nextSeed = params.get('seed')
        if (parseSeed(nextSeed) !== null) setSeed(nextSeed)
        const tool = params.get('tool')
        if (tool && tools.some((item) => item.id === tool)) setSelected(tool)
    }, [])
    const filtered = useMemo(() => {
        const ordered = seed ? seededShuffle(tools, seedToNumber(seed)) : tools
        return filterTools(ordered, tag, query).filter((tool) => category === 'all' || tool.category === category)
    }, [query, tag, category, seed])
    const active = filtered.find((tool) => tool.id === selected) ?? filtered[0]
    const updateUrl = (key: string, value: string | null) => {
        const url = new URL(window.location.href)
        if (value && value !== 'all') url.searchParams.set(key, value)
        else url.searchParams.delete(key)
        window.history.replaceState(null, '', url)
    }
    const shuffle = () => {
        const next = randomSeed()
        setSeed(next)
        setSelected('')
        setCopied(false)
        updateUrl('tool', null)
        updateUrl('seed', next)
    }
    const copyLink = async () => {
        try {
            const url = new URL(window.location.href)
            if (active) url.searchParams.set('tool', active.id)
            await navigator.clipboard.writeText(url.toString())
            setCopied(true)
        } catch {
            setCopied(false)
        }
    }
    return (
        <section className="tool-explorer" id="tools" aria-labelledby="explorer-title">
            <div className="explorer-heading">
                <h1 id="explorer-title">{zh ? '好工具，逐个发现。' : 'Find your next good tool.'}</h1>
                <span>
                    {tools.length} {zh ? '款精选工具' : 'curated tools'}
                </span>
            </div>
            <div className="explorer-controls">
                <label className="explorer-search">
                    <span>{zh ? '搜索' : 'Search'}</span>
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value)
                            updateUrl('q', event.target.value)
                        }}
                        placeholder={zh ? '工具名称、用途…' : 'Name or purpose…'}
                    />
                </label>
                <div className="explorer-categories" role="group" aria-label={zh ? '分类' : 'Category'}>
                    {['all', ...CATEGORY_ORDER].map((item) => (
                        <button
                            type="button"
                            key={item}
                            aria-pressed={category === item}
                            onClick={() => {
                                setCategory(item)
                                updateUrl('category', item)
                            }}
                        >
                            {item === 'all'
                                ? zh
                                    ? '全部'
                                    : 'All'
                                : CATEGORY_LABELS[item as keyof typeof CATEGORY_LABELS][lang]}
                        </button>
                    ))}
                </div>
                <label className="explorer-tag">
                    <span className="sr-only">{zh ? '标签' : 'Tag'}</span>
                    <select
                        value={tag}
                        onChange={(event) => {
                            setTag(event.target.value)
                            updateUrl('tag', event.target.value)
                        }}
                    >
                        <option value="all">{zh ? '所有标签' : 'All tags'}</option>
                        {getAllTags(tools).map((item) => (
                            <option key={item} value={item}>
                                {tagLabel(item)}
                            </option>
                        ))}
                    </select>
                </label>
                <button className="explorer-shuffle" type="button" onClick={shuffle}>
                    <ShuffleIcon size={18} />
                    {zh ? '换个顺序' : 'Shuffle'}
                </button>
            </div>
            <div className="explorer-workspace">
                <div className="explorer-index">
                    <div className="explorer-index-head">
                        <span>{zh ? '工具目录' : 'Collection'}</span>
                        <span aria-live="polite">
                            {filtered.length} / {tools.length}
                        </span>
                    </div>
                    <div
                        className="explorer-list"
                        role="group"
                        aria-label={zh ? '选择预览工具' : 'Choose a tool to preview'}
                    >
                        {filtered.map((tool) => (
                            <button
                                type="button"
                                key={tool.id}
                                className="explorer-item"
                                aria-pressed={active?.id === tool.id}
                                onClick={() => {
                                    setSelected(tool.id)
                                    updateUrl('tool', tool.id)
                                    setCopied(false)
                                }}
                            >
                                <span className="explorer-item-mark" aria-hidden="true">
                                    {tool.name[lang].slice(0, 1)}
                                </span>
                                <span>
                                    <strong>{tool.name[lang]}</strong>
                                    <small>{getDomain(tool.url)}</small>
                                </span>
                                <ArrowRightIcon size={16} aria-hidden="true" />
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <div className="explorer-empty">
                                <p>{zh ? '没有找到匹配工具' : 'No matching tools'}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery('')
                                        setTag('all')
                                        setCategory('all')
                                        updateUrl('tag', null)
                                        updateUrl('category', null)
                                        updateUrl('q', null)
                                    }}
                                >
                                    {zh ? '清除筛选' : 'Clear filters'}
                                </button>
                            </div>
                        )}
                    </div>
                    {seed && (
                        <div className="explorer-order">
                            <button
                                type="button"
                                onClick={() => {
                                    setSeed(null)
                                    updateUrl('seed', null)
                                }}
                            >
                                {zh ? '恢复精选顺序' : 'Restore curated order'}
                            </button>
                        </div>
                    )}
                </div>
                {active && (
                    <article className="explorer-preview" aria-label={zh ? '工具预览' : 'Tool preview'}>
                        <div className="explorer-preview-bar">
                            <span>{getDomain(active.url)}</span>
                            <a href={active.url} target="_blank" rel="noopener noreferrer">
                                {zh ? '打开网站' : 'Open website'}
                                <ArrowSquareOutIcon size={16} />
                            </a>
                        </div>
                        <Link
                            className="explorer-image"
                            href={getToolPath(active.id)}
                            aria-label={`${active.name[lang]} ${zh ? '详情' : 'details'}`}
                        >
                            <ToolPreviewImage
                                key={active.id}
                                tool={active}
                                sizes="(min-width: 900px) 900px, 100vw"
                                eager
                                alt={`${active.name[lang]} ${zh ? '网站预览' : 'website preview'}`}
                            />
                        </Link>
                        <div className="explorer-detail" aria-live="polite">
                            <div>
                                <h2>{active.name[lang]}</h2>
                                <p>{active.description[lang]}</p>
                            </div>
                            <div className="explorer-actions">
                                <Link href={getToolPath(active.id)}>
                                    {zh ? '使用建议' : 'Read the notes'}
                                    <span aria-hidden="true"> →</span>
                                </Link>
                                <button type="button" onClick={copyLink}>
                                    {copied ? (zh ? '链接已复制' : 'Link copied') : zh ? '复制链接' : 'Copy link'}
                                </button>
                            </div>
                            <div className="explorer-tags">
                                {active.tags.map((item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        onClick={() => {
                                            setTag(item)
                                            updateUrl('tag', item)
                                        }}
                                    >
                                        {tagLabel(item)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </article>
                )}
            </div>
        </section>
    )
}
