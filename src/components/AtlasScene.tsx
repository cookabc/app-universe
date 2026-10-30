'use client'

import { ArrowSquareOutIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { normalizeLanguage } from '@/components/I18nProvider'
import { ToolPreviewImage } from '@/components/ToolPreviewImage'
import type { Tool } from '@/data/tools'
import { getToolPath } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { parseVerdict } from '@/lib/curator-note'
import { getDomain } from '@/lib/filter-tools'

function move(note: string | undefined, lang: 'en' | 'zh', key: 'when' | 'replaces' | 'caveat') {
    if (!note) return ''
    const text = parseVerdict(note, lang)?.[key] ?? note
    return lang === 'zh' ? text.replace(/^注意[：:]\s*/, '') : text.replace(/^(When |Replaces |Caveat:)\s*/i, '')
}

export default function AtlasScene({
    tool,
    tools,
    index,
    onSelect,
}: {
    tool: Tool
    tools: Tool[]
    index: number
    onSelect: (tool: Tool) => void
}) {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const [flipped, setFlipped] = useState(false)
    const note = tool.note?.[lang] || tool.note?.en
    const name = tool.name[lang] || tool.name.en
    const seen = new Set([tool.id])
    const neighbors = [-2, -1, 1, 2]
        .map((offset) => ({ offset, tool: tools[(index + offset + tools.length) % tools.length] }))
        .filter((item) => {
            if (!item.tool || seen.has(item.tool.id)) return false
            seen.add(item.tool.id)
            return true
        })

    return (
        <div className="atlas-scene">
            <div className="atlas-scene-topline">
                <div>
                    <span className="atlas-current-kicker">{isReady ? t('atlas.current') : 'Current discovery'}</span>
                    <h2>{name}</h2>
                </div>
                <span className="atlas-scene-index">
                    {String(index + 1).padStart(2, '0')} / {String(tools.length).padStart(2, '0')}
                </span>
            </div>

            <div className={`atlas-orbit-stage${flipped ? ' is-flipped' : ''}`}>
                <div className="atlas-orbit-line atlas-orbit-line--one" aria-hidden="true" />
                <div className="atlas-orbit-line atlas-orbit-line--two" aria-hidden="true" />
                {neighbors.map(({ offset, tool: neighbor }) => (
                    <button
                        type="button"
                        key={neighbor.id}
                        className={`atlas-neighbor atlas-neighbor--${offset > 0 ? 'after' : 'before'} atlas-neighbor--${Math.abs(offset)}`}
                        onClick={() => onSelect(neighbor)}
                        aria-label={`${isReady ? t('atlas.explore') : 'Explore'}: ${neighbor.name[lang] || neighbor.name.en}`}
                    >
                        <span className="atlas-neighbor-image">
                            <ToolPreviewImage tool={neighbor} sizes="180px" />
                        </span>
                        <span>{neighbor.name[lang] || neighbor.name.en}</span>
                    </button>
                ))}

                <div className="atlas-focus">
                    <div className="atlas-focus-face atlas-focus-front" aria-hidden={flipped} inert={flipped}>
                        <Link
                            href={getToolPath(tool.id)}
                            aria-label={`${isReady ? t('toolsWall.details') : 'Details'}: ${name}`}
                        >
                            <ToolPreviewImage tool={tool} sizes="(min-width: 900px) 58vw, 92vw" eager />
                        </Link>
                        <div className="atlas-focus-caption">
                            <span>{getDomain(tool.url)}</span>
                            <span>{tool.description[lang] || tool.description.en}</span>
                        </div>
                    </div>
                    <div className="atlas-focus-face atlas-focus-back" aria-hidden={!flipped} inert={!flipped}>
                        <div className="atlas-back-heading">
                            <span>{isReady ? t('atlas.curator') : 'Curator’s note'}</span>
                            <h3>{name}</h3>
                        </div>
                        {note && (
                            <dl>
                                <div>
                                    <dt>{isReady ? t('verdict.when') : 'When to use it'}</dt>
                                    <dd>{move(note, lang, 'when')}</dd>
                                </div>
                                <div>
                                    <dt>{isReady ? t('verdict.replaces') : 'What it replaces'}</dt>
                                    <dd>{move(note, lang, 'replaces')}</dd>
                                </div>
                                <div>
                                    <dt>{isReady ? t('verdict.caveat') : 'Worth knowing'}</dt>
                                    <dd>{move(note, lang, 'caveat')}</dd>
                                </div>
                            </dl>
                        )}
                    </div>
                </div>
            </div>

            <div className="atlas-scene-actions">
                <button
                    type="button"
                    className="atlas-flip"
                    onClick={() => setFlipped((value) => !value)}
                    aria-pressed={flipped}
                >
                    <ArrowsClockwiseIcon weight="regular" />
                    {flipped
                        ? isReady
                            ? t('atlas.front')
                            : 'Back to preview'
                        : isReady
                          ? t('atlas.back')
                          : 'Why this tool?'}
                </button>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="atlas-visit">
                    {isReady ? t('toolDetail.openSite') : 'Open site'} <ArrowSquareOutIcon weight="bold" />
                </a>
                <Link href={getToolPath(tool.id)} className="atlas-detail">
                    {isReady ? t('toolsWall.details') : 'Details'}
                </Link>
            </div>
        </div>
    )
}
