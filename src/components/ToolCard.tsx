'use client'

import { ArrowSquareOutIcon, GithubLogoIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import type { Tool } from '@/data/tools'
import { formatTag } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { getIcon } from '@/lib/icon-map'

interface ToolCardProps {
    tool: Tool
    featured?: boolean
}

function getDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

export function ToolCard({ tool, featured = false }: ToolCardProps) {
    const { i18n, t, isReady } = useI18nReady()
    const lang = i18n.language as 'en' | 'zh'
    const Icon = getIcon(tool.icon)
    const [imgError, setImgError] = useState(false)

    const name = tool.name[lang] || tool.name.en
    const desc = tool.description[lang] || tool.description.en
    const note = tool.note?.[lang] || tool.note?.en
    const domain = getDomain(tool.url)
    const previewSrc = `/previews/${tool.id}.png`

    return (
        <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group block surface surface-active h-full ${featured ? 'md:flex md:flex-row' : ''}`}
        >
            {/* Preview */}
            <div
                className={`relative overflow-hidden bg-muted ${featured ? 'aspect-[2/1] md:aspect-auto md:w-2/5 md:min-w-[240px]' : 'aspect-[2/1]'}`}
            >
                {!imgError ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewSrc}
                            alt={`${name} preview`}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent" />
                    </>
                ) : (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: `${tool.color}15` }}
                    >
                        <Icon className="h-12 w-12" style={{ color: tool.color }} />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={`flex flex-col p-4 ${featured ? 'md:flex-1' : ''}`}>
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: tool.color }}
                    >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3
                                className={`font-semibold text-foreground truncate ${featured ? 'text-base' : 'text-sm'}`}
                            >
                                {name}
                            </h3>
                            <ArrowSquareOutIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" weight="bold" />
                        </div>
                        <p className="text-[11px] text-muted-foreground/70 font-mono truncate">{domain}</p>
                    </div>
                    {tool.githubUrl && (
                        <span
                            role="link"
                            aria-label="GitHub repository"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(tool.githubUrl, '_blank', 'noopener,noreferrer')
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.open(tool.githubUrl, '_blank', 'noopener,noreferrer')
                                }
                            }}
                            tabIndex={0}
                            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <GithubLogoIcon className="h-3.5 w-3.5" weight="regular" />
                        </span>
                    )}
                </div>

                {/* Description */}
                <p
                    className={`text-muted-foreground line-clamp-2 mt-3 ${featured ? 'text-sm leading-relaxed' : 'text-xs leading-relaxed'}`}
                >
                    {desc}
                </p>

                {/* Curator note */}
                {note && (
                    <p className="text-xs text-muted-foreground/80 italic mt-2 line-clamp-1">
                        {isReady ? `${t('toolsWall.curatorNote')}: ` : 'Note: '}
                        {note}
                    </p>
                )}

                {/* Tags + footer */}
                <div className="mt-auto pt-3 flex items-center justify-between gap-3">
                    {tool.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {tool.tags.slice(0, featured ? 5 : 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground"
                                >
                                    {formatTag(tag)}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span />
                    )}
                    <span className="text-[11px] font-medium text-primary flex items-center gap-0.5 flex-shrink-0">
                        Visit
                        <ArrowSquareOutIcon
                            className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            weight="bold"
                        />
                    </span>
                </div>
            </div>
        </a>
    )
}
