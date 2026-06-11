'use client'

import { ExternalLink, Github, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { Tool } from '@/data/tools'
import { TOOL_CATEGORIES } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { useScreenshot } from '@/hooks/useScreenshot'
import { getIcon } from '@/lib/icon-map'

interface ToolCardProps {
    tool: Tool
}

function getDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

export function ToolCard({ tool }: ToolCardProps) {
    const { i18n, t, isReady } = useI18nReady()
    const lang = i18n.language as 'en' | 'zh'
    const Icon = getIcon(tool.icon)
    const category = TOOL_CATEGORIES.find((c) => c.key === tool.category)

    const name = tool.name[lang] || tool.name.en
    const desc = tool.description[lang] || tool.description.en
    const note = tool.note?.[lang] || tool.note?.en
    const domain = getDomain(tool.url)

    const { src, isLoading, error, service } = useScreenshot({
        toolId: tool.id,
        url: tool.url,
    })
    const [imgError, setImgError] = useState(false)

    const showFallback = error || imgError || (!isLoading && !src)

    return (
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
            <div className="relative h-full overflow-hidden rounded-[var(--radius)] border-2 border-slate-800 bg-card transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 shadow-[var(--box-shadow)] hover:shadow-[calc(var(--box-shadow)_+_4px)]">
                {/* Preview */}
                <div className="relative aspect-[2/1] overflow-hidden bg-muted">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                        </div>
                    )}
                    {!showFallback && src ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={src}
                                alt={`${name} preview`}
                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                                loading="lazy"
                                onError={() => setImgError(true)}
                            />
                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
                            {/* Service indicator */}
                            {service && (
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/50 text-white/80 backdrop-blur-sm">
                                    {service === 'microlink' ? 'ML' : service === 'thum' ? 'TH' : 'FB'}
                                </div>
                            )}
                        </>
                    ) : showFallback ? (
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: tool.color }}
                        >
                            <Icon className="h-10 w-10 text-white/20" />
                        </div>
                    ) : null}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-3.5 space-y-1.5">
                    {/* Header */}
                    <div className="flex items-center gap-2.5">
                        <div
                            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: tool.color }}
                        >
                            <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-sm font-bold text-foreground truncate">{name}</h3>
                                <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
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
                                        <Github className="h-3 w-3" />
                                    </span>
                                )}
                                {category && category.key !== 'all' && (
                                    <span
                                        className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ml-auto"
                                        style={{
                                            backgroundColor: `${category.color}15`,
                                            color: category.color,
                                        }}
                                    >
                                        {category.label[lang] || category.label.en}
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-muted-foreground/60 font-mono truncate">{domain}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{desc}</p>

                    {/* Tags */}
                    {tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {tool.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Curator note */}
                    {note && (
                        <p className="text-xs text-muted-foreground/70 italic line-clamp-1">
                            {isReady ? `${t('toolsWall.curatorNote')}: ` : 'Note: '}
                            {note}
                        </p>
                    )}
                </div>
            </div>
        </a>
    )
}
