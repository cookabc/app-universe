'use client'

import { ArrowLeftIcon, ArrowSquareOutIcon, GithubLogoIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { normalizeLanguage } from '@/components/I18nProvider'
import type { Tool } from '@/data/tools'
import { formatTag, getToolPath } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { getIcon } from '@/lib/icon-map'

function getDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

interface ToolDetailProps {
    tool: Tool
    related: Tool[]
}

export function ToolDetail({ tool, related }: ToolDetailProps) {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const Icon = getIcon(tool.icon)
    const [imgError, setImgError] = useState(false)

    const name = tool.name[lang] || tool.name.en
    const desc = tool.description[lang] || tool.description.en
    const note = tool.note?.[lang] || tool.note?.en
    const domain = getDomain(tool.url)
    const previewSrc = `/previews/${tool.id}.png`
    const visitLabel = isReady ? t('toolsWall.visit') : 'Visit'
    const githubLabel = isReady ? t('toolsWall.githubRepo') : 'GitHub repository'
    const opensInNewTab = isReady ? t('toolsWall.opensInNewTab') : 'opens in a new tab'
    const backLabel = isReady ? t('toolDetail.back') : 'Back to tools'
    const whyLabel = isReady ? t('toolDetail.whyIUseIt') : 'Why I use it'
    const relatedLabel = isReady ? t('toolDetail.related') : 'Related tools'
    const openExternal = isReady ? t('toolDetail.openSite') : 'Open site'
    const featuredLabel = isReady ? t('toolsWall.featuredBadge') : 'Featured'

    const tagLabel = (tag: string) => {
        if (isReady) {
            const key = `tags.${tag}`
            const translated = t(key)
            if (translated !== key) return translated
        }
        return formatTag(tag)
    }

    return (
        <article className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
            <Link
                href="/#tools"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
                <ArrowLeftIcon className="h-4 w-4" weight="bold" />
                {backLabel}
            </Link>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
                <div className="relative overflow-hidden radius-outer surface min-h-[220px] sm:min-h-[280px]">
                    {!imgError ? (
                        <img
                            src={previewSrc}
                            alt={isReady ? t('toolsWall.previewAlt', { name }) : `${name} preview`}
                            width={960}
                            height={540}
                            className="w-full h-full object-cover object-top min-h-[220px] sm:min-h-[280px]"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div
                            className="flex min-h-[220px] sm:min-h-[280px] items-center justify-center"
                            style={{ backgroundColor: `${tool.color}18` }}
                        >
                            <Icon className="h-16 w-16" style={{ color: tool.color }} weight="duotone" />
                        </div>
                    )}
                    {tool.featured && (
                        <span className="absolute top-3 left-3 rounded-full bg-foreground/90 text-background text-[10px] font-semibold px-2.5 py-1 tracking-wide">
                            {featuredLabel}
                        </span>
                    )}
                </div>

                <div className="space-y-5">
                    <header className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div
                                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white"
                                style={{ backgroundColor: tool.color }}
                            >
                                <Icon className="h-5 w-5" weight="bold" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                                    {name}
                                </h1>
                                <p className="text-sm text-muted-foreground font-mono mt-1">{domain}</p>
                            </div>
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed text-pretty">{desc}</p>
                    </header>

                    {note && (
                        <section className="surface radius-outer p-4 sm:p-5">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                {whyLabel}
                            </h2>
                            <p className="text-sm sm:text-[0.95rem] text-foreground/90 leading-relaxed">{note}</p>
                        </section>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                        {tool.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/?tag=${encodeURIComponent(tag)}#tools`}
                                className="px-2.5 py-1 radius-inner text-xs font-medium bg-muted text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-colors"
                            >
                                {tagLabel(tag)}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-inner)] bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                        >
                            {openExternal}
                            <ArrowSquareOutIcon className="h-4 w-4" weight="bold" />
                            <span className="sr-only">({opensInNewTab})</span>
                        </a>
                        {tool.githubUrl && (
                            <a
                                href={tool.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-inner)] border border-border bg-card text-sm font-medium text-foreground hover:border-primary/30 transition-colors"
                                aria-label={`${githubLabel} (${opensInNewTab})`}
                            >
                                <GithubLogoIcon className="h-4 w-4" weight="regular" />
                                GitHub
                            </a>
                        )}
                        <span className="text-xs text-muted-foreground/80 hidden sm:inline">{visitLabel}</span>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section className="mt-14" aria-labelledby="related-tools-heading">
                    <h2 id="related-tools-heading" className="text-sm font-semibold text-foreground mb-4">
                        {relatedLabel}
                    </h2>
                    <ul className="grid gap-3 sm:grid-cols-3">
                        {related.map((item) => {
                            const RelatedIcon = getIcon(item.icon)
                            const relatedName = item.name[lang] || item.name.en
                            return (
                                <li key={item.id}>
                                    <Link
                                        href={getToolPath(item.id)}
                                        className="surface surface-active radius-outer flex items-center gap-3 p-3 h-full hover:border-primary/20 transition-colors"
                                    >
                                        <div
                                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            <RelatedIcon className="h-4 w-4" weight="bold" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">
                                                {relatedName}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground truncate">
                                                {item.tags.map(tagLabel).join(' · ')}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </section>
            )}
        </article>
    )
}
