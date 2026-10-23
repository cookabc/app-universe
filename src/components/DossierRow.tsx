'use client'

import { ArrowSquareOutIcon, GithubLogoIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { normalizeLanguage } from '@/components/I18nProvider'
import { ToolPreviewImage } from '@/components/ToolPreviewImage'
import { VerdictCard } from '@/components/VerdictCard'
import type { Tool } from '@/data/tools'
import { formatToolNumber, getToolNumber, getToolPath } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { useTagLabel } from '@/hooks/useTagLabel'
import { getDomain } from '@/lib/filter-tools'

interface DossierRowProps {
    tool: Tool
    onTagClick?: (tag: string) => void
}

/**
 * One entry in the archive, as a dossier row.
 *
 * The catalogue used to be a wall of cards, which is the wrong shape for
 * this: a field guide is read down a column, not scanned as a grid. Each
 * row here carries the entry number, the thumbnail, the name and domain, the
 * description, and — the point of the whole site — the curator's verdict,
 * with its three moves already separated.
 *
 * The thumbnail is the tool's own colour rather than a generic icon, so a
 * row is identifiable by its colour before its name is read.
 */
export function DossierRow({ tool, onTagClick }: DossierRowProps) {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const tagLabel = useTagLabel()

    const name = tool.name[lang] || tool.name.en
    const desc = tool.description[lang] || tool.description.en
    const note = tool.note?.[lang] || tool.note?.en
    const domain = getDomain(tool.url)
    const detailHref = getToolPath(tool.id)

    const visitLabel = isReady ? t('toolsWall.visit') : 'Visit'
    const detailsLabel = isReady ? t('toolsWall.details') : 'Details'
    const githubLabel = isReady ? t('toolsWall.githubRepo') : 'GitHub repository'
    const previewAlt = isReady ? t('toolsWall.previewAlt', { name }) : `${name} preview`
    const opensInNewTab = isReady ? t('toolsWall.opensInNewTab') : 'opens in a new tab'
    const curatorNoteLabel = isReady ? t('toolsWall.curatorNote') : 'Note'
    const verdictLabels = {
        when: isReady ? t('verdict.when') : 'When',
        replaces: isReady ? t('verdict.replaces') : 'Replaces',
        caveat: isReady ? t('verdict.caveat') : 'Caveat',
    }

    return (
        <article className="dossier">
            <Link href={detailHref} className="dossier__thumb" aria-label={previewAlt}>
                <ToolPreviewImage
                    tool={tool}
                    sizes="(min-width: 1024px) 168px, 84px"
                    className="dossier__thumb-image"
                />
                <span className="dossier__swatch" style={{ backgroundColor: tool.color }} aria-hidden="true" />
            </Link>

            <div className="dossier__body">
                <div className="dossier__head">
                    <span className="index-label index-label--accent">{formatToolNumber(getToolNumber(tool.id))}</span>
                    <Link href={detailHref} className="dossier__name">
                        {name}
                    </Link>
                    <span className="dossier__domain index-label">{domain}</span>
                    <div className="dossier__links">
                        {tool.githubUrl && (
                            <a
                                href={tool.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${githubLabel} (${opensInNewTab})`}
                                className="dossier__icon-link"
                            >
                                <GithubLogoIcon className="h-4 w-4" weight="regular" />
                            </a>
                        )}
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${visitLabel} (${opensInNewTab})`}
                            className="dossier__icon-link dossier__icon-link--primary"
                        >
                            <ArrowSquareOutIcon className="h-4 w-4" weight="bold" />
                        </a>
                    </div>
                </div>

                <p className="dossier__desc">{desc}</p>

                {note && (
                    <VerdictCard
                        note={note}
                        language={lang === 'zh' ? 'zh' : 'en'}
                        label={curatorNoteLabel}
                        labels={verdictLabels}
                        variant="open"
                    />
                )}

                <div className="dossier__foot">
                    <div className="dossier__tags">
                        {tool.tags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => onTagClick?.(tag)}
                                className="index-label dossier__tag"
                            >
                                {tagLabel(tag)}
                            </button>
                        ))}
                    </div>
                    <Link href={detailHref} className="index-label index-label--foreground dossier__detail">
                        {detailsLabel} →
                    </Link>
                </div>
            </div>
        </article>
    )
}
