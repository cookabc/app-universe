'use client'

import { ArrowSquareOutIcon, GithubLogoIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { normalizeLanguage } from '@/components/I18nProvider'
import type { Tool } from '@/data/tools'
import { formatTag, getToolPath } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { getDomain } from '@/lib/filter-tools'
import { getIcon } from '@/lib/icon-map'

interface ToolCardProps {
    tool: Tool
    onTagClick?: (tag: string) => void
    /** Larger preview + full curator note (featured strip). */
    variant?: 'default' | 'featured'
}

export function ToolCard({ tool, onTagClick, variant = 'default' }: ToolCardProps) {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const Icon = getIcon(tool.icon)
    const [imgError, setImgError] = useState(false)
    const featured = variant === 'featured'
    const detailHref = getToolPath(tool.id)

    const name = tool.name[lang] || tool.name.en
    const desc = tool.description[lang] || tool.description.en
    const note = tool.note?.[lang] || tool.note?.en
    const domain = getDomain(tool.url)
    const previewSrc = `/previews/${tool.id}.png`
    const visitLabel = isReady ? t('toolsWall.visit') : 'Visit'
    const detailsLabel = isReady ? t('toolsWall.details') : 'Details'
    const githubLabel = isReady ? t('toolsWall.githubRepo') : 'GitHub repository'
    const previewAlt = isReady ? t('toolsWall.previewAlt', { name }) : `${name} preview`
    const opensInNewTab = isReady ? t('toolsWall.opensInNewTab') : 'opens in a new tab'

    const tagLabel = (tag: string) => {
        if (isReady) {
            const key = `tags.${tag}`
            const translated = t(key)
            if (translated !== key) return translated
        }
        return formatTag(tag)
    }

    return (
        <article
            className={`group relative flex flex-col h-full bg-card border border-border transition-shadow hover:shadow-md ${
                featured ? 'md:col-span-2' : ''
            }`}
        >
            <Link
                href={detailHref}
                className={`relative block overflow-hidden bg-muted border-b border-border ${featured ? 'aspect-[2/1]' : 'aspect-[16/10]'}`}
            >
                {!imgError ? (
                    <img
                        src={previewSrc}
                        alt={previewAlt}
                        width={640}
                        height={400}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: `${tool.color}15` }}
                    >
                        <Icon className="h-12 w-12" style={{ color: tool.color }} weight="duotone" />
                    </div>
                )}
            </Link>

            <div className={`flex flex-col flex-1 ${featured ? 'p-6' : 'p-5'}`}>
                <div className="flex items-baseline justify-between gap-3">
                    <Link href={detailHref} className="min-w-0">
                        <h3
                            className={`serif-display text-foreground truncate group-hover:underline underline-offset-4 ${
                                featured ? 'text-2xl' : 'text-xl'
                            }`}
                        >
                            {name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {tool.githubUrl && (
                            <a
                                href={tool.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${githubLabel} (${opensInNewTab})`}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <GithubLogoIcon className="h-4 w-4" weight="regular" />
                            </a>
                        )}
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${visitLabel} (${opensInNewTab})`}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowSquareOutIcon className="h-4 w-4" weight="bold" />
                        </a>
                    </div>
                </div>
                <p className="index-label mt-1">{domain}</p>

                <p className="text-muted-foreground mt-4 text-sm leading-relaxed line-clamp-2 text-pretty">{desc}</p>

                {note && (
                    <p className="text-sm text-foreground/80 mt-3 leading-relaxed border-l-2 border-accent pl-3 line-clamp-2">
                        {note}
                    </p>
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
                                    className="index-label hover:text-foreground transition-colors"
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
                        className="index-label flex-shrink-0 hover:text-foreground transition-colors"
                    >
                        {detailsLabel} →
                    </Link>
                </div>
            </div>
        </article>
    )
}
