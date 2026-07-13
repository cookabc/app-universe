'use client'

import { ArrowSquareOutIcon, GithubLogoIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import type { Tool } from '@/data/tools'
import { formatTag } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { getIcon } from '@/lib/icon-map'

interface ToolCardProps {
    tool: Tool
    onTagClick?: (tag: string) => void
}

function getDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

export function ToolCard({ tool, onTagClick }: ToolCardProps) {
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
        <article className="group surface surface-active radius-outer flex flex-col overflow-hidden h-full">
            {/* Preview */}
            <div className="relative overflow-hidden bg-muted flex-1 min-h-[160px]">
                {!imgError ? (
                    <>
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
            <div className="flex flex-col p-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: tool.color }}
                    >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/title flex items-center gap-1.5"
                        >
                            <h3 className="font-semibold text-foreground truncate text-sm">{name}</h3>
                            <ArrowSquareOutIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" weight="bold" />
                        </a>
                        <p className="text-[11px] text-muted-foreground/70 font-mono truncate">{domain}</p>
                    </div>
                    {tool.githubUrl && (
                        <a
                            href={tool.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub repository"
                            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <GithubLogoIcon className="h-3.5 w-3.5" weight="regular" />
                        </a>
                    )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground mt-3 line-clamp-3 text-xs leading-relaxed">{desc}</p>

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
                            {tool.tags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onTagClick?.(tag)
                                    }}
                                    className="px-1.5 py-0.5 radius-inner text-[10px] font-medium bg-muted text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-colors"
                                >
                                    {formatTag(tag)}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <span />
                    )}
                    <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-primary flex items-center gap-0.5 flex-shrink-0 hover:underline"
                    >
                        Visit
                        <ArrowSquareOutIcon
                            className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            weight="bold"
                        />
                    </a>
                </div>
            </div>
        </article>
    )
}
