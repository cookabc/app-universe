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

interface ToolCardProps {
    tool: Tool
    onTagClick?: (tag: string) => void
    /** Larger preview + full curator note (featured strip). */
    variant?: 'default' | 'featured'
    featuredIndex?: number
}

export function ToolCard({ tool, onTagClick, variant = 'default', featuredIndex = 0 }: ToolCardProps) {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const tagLabel = useTagLabel()
    const featured = variant === 'featured'
    const detailHref = getToolPath(tool.id)

    const name = tool.name[lang] || tool.name.en
    const desc = tool.description[lang] || tool.description.en
    const note = tool.note?.[lang] || tool.note?.en
    const domain = getDomain(tool.url)
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
    const verdictFlipCue = isReady ? t('verdict.flip') : 'See what it replaces'
    const verdictBackCue = isReady ? t('verdict.back') : 'Turn back'

    return (
        <article
            className={`tool-card-lift atlas-card group relative flex h-full flex-col overflow-hidden border border-foreground bg-card ${
                featured
                    ? featuredIndex === 0
                        ? 'lg:col-span-8 lg:grid lg:grid-cols-2'
                        : featuredIndex === 1
                          ? 'lg:col-span-4'
                          : 'lg:col-span-6'
                    : ''
            }`}
        >
            {featured && <span className="featured-tab">{isReady ? t('toolsWall.featuredBadge') : 'Featured'}</span>}
            <Link
                href={detailHref}
                className={`relative block overflow-hidden bg-muted ${
                    featuredIndex === 0 && featured
                        ? 'min-h-64 border-b border-foreground lg:min-h-full lg:border-r lg:border-b-0'
                        : `border-b border-foreground ${featured ? 'aspect-[16/9]' : 'aspect-[16/10]'}`
                }`}
            >
                <ToolPreviewImage
                    tool={tool}
                    sizes={
                        featured
                            ? '(min-width: 1024px) 800px, (min-width: 768px) 50vw, 100vw'
                            : '(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw'
                    }
                    alt={previewAlt}
                    className="group-hover:scale-[1.02]"
                />
            </Link>

            <div className={`flex flex-1 flex-col ${featured ? 'p-6' : 'p-5'}`}>
                <div className="flex items-baseline justify-between gap-3">
                    <Link href={detailHref} className="min-w-0">
                        <h3
                            className={`display-heading text-foreground truncate group-hover:text-primary transition-colors ${
                                featured ? 'text-2xl' : 'text-base'
                            }`}
                        >
                            {name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {tool.githubUrl && (
                            <a
                                href={tool.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${githubLabel} (${opensInNewTab})`}
                                className="flex h-11 w-11 items-center justify-center border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                            >
                                <GithubLogoIcon className="h-4 w-4" weight="regular" />
                            </a>
                        )}
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${visitLabel} (${opensInNewTab})`}
                            className="flex h-11 w-11 items-center justify-center bg-primary text-primary-foreground hover:opacity-85 transition-opacity"
                        >
                            <ArrowSquareOutIcon className="h-4 w-4" weight="bold" />
                        </a>
                    </div>
                </div>
                <p className="index-label index-label--primary mt-1">
                    {formatToolNumber(getToolNumber(tool.id))} {domain}
                </p>

                <p className="text-muted-foreground mt-4 text-sm leading-relaxed line-clamp-2 text-pretty">{desc}</p>

                {note && (
                    <VerdictCard
                        note={note}
                        language={lang === 'zh' ? 'zh' : 'en'}
                        label={curatorNoteLabel}
                        labels={verdictLabels}
                        flipCue={verdictFlipCue}
                        backCue={verdictBackCue}
                    />
                )}

                <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                    {tool.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {tool.tags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onTagClick?.(tag)
                                    }}
                                    className="index-label inline-flex min-h-8 items-center border border-border px-2 hover:border-foreground hover:text-foreground transition-colors"
                                >
                                    {tagLabel(tag)}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <span />
                    )}
                    <Link
                        href={detailHref}
                        className="index-label index-label--foreground flex min-h-11 flex-shrink-0 items-center border-b border-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                        {detailsLabel} →
                    </Link>
                </div>
            </div>
        </article>
    )
}
