'use client'

import { ArrowLeftIcon, ArrowSquareOutIcon, GithubLogoIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { normalizeLanguage } from '@/components/I18nProvider'
import type { Tool } from '@/data/tools'
import { formatTag, getToolPath } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { getDomain } from '@/lib/filter-tools'
import { getIcon } from '@/lib/icon-map'

interface ToolDetailProps {
    tool: Tool
    related: Tool[]
}

export function ToolDetail({ tool, related }: ToolDetailProps) {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const Icon = getIcon(tool.icon)
    const [imgError, setImgError] = useState(false)
    const [relatedImgError, setRelatedImgError] = useState<Record<string, boolean>>({})

    const name = tool.name[lang] || tool.name.en
    const desc = tool.description[lang] || tool.description.en
    const note = tool.note?.[lang] || tool.note?.en
    const domain = getDomain(tool.url)
    const previewSrc = `/previews/${tool.id}.png`
    const githubLabel = isReady ? t('toolsWall.githubRepo') : 'GitHub repository'
    const opensInNewTab = isReady ? t('toolsWall.opensInNewTab') : 'opens in a new tab'
    const backLabel = isReady ? t('toolDetail.back') : 'Back to tools'
    const whyLabel = isReady ? t('toolDetail.whyIUseIt') : 'Why I use it'
    const relatedLabel = isReady ? t('toolDetail.related') : 'Related tools'
    const openExternal = isReady ? t('toolDetail.openSite') : 'Open site'

    const tagLabel = (tag: string) => {
        if (isReady) {
            const key = `tags.${tag}`
            const translated = t(key)
            if (translated !== key) return translated
        }
        return formatTag(tag)
    }

    return (
        <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <Link
                href="/#tools"
                className="index-label inline-flex items-center gap-1.5 hover:text-foreground transition-colors mb-10 min-h-[44px]"
            >
                <ArrowLeftIcon className="h-3.5 w-3.5" weight="bold" />
                {backLabel}
            </Link>

            <div className="border border-border bg-card">
                <header className="p-6 sm:p-8 border-b border-border space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-3">
                            <h1 className="serif-display text-4xl sm:text-5xl leading-[1.02] tracking-tight text-foreground text-balance">
                                {name}
                            </h1>
                        </div>
                        <span className="archive-tab flex-shrink-0 mt-1">{domain}</span>
                    </div>
                    <p className="measure text-base text-muted-foreground leading-relaxed text-pretty">{desc}</p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                        {tool.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/?tag=${encodeURIComponent(tag)}#tools`}
                                className="index-label hover:text-foreground transition-colors"
                            >
                                {tagLabel(tag)}
                            </Link>
                        ))}
                    </div>
                </header>

                <div className="relative bg-muted overflow-hidden border-b border-border">
                    {!imgError ? (
                        <img
                            src={previewSrc}
                            alt={isReady ? t('toolsWall.previewAlt', { name }) : `${name} preview`}
                            width={1200}
                            height={675}
                            className="w-full aspect-video object-cover object-top"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div
                            className="flex aspect-video items-center justify-center"
                            style={{ backgroundColor: `${tool.color}18` }}
                        >
                            <Icon className="h-16 w-16" style={{ color: tool.color }} weight="duotone" />
                        </div>
                    )}
                </div>

                <div className="p-6 sm:p-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
                    {note ? (
                        <section aria-labelledby="why-heading">
                            <h2 id="why-heading" className="index-label mb-4">
                                {whyLabel}
                            </h2>
                            <p className="serif-display text-xl sm:text-2xl leading-relaxed text-foreground/90 text-pretty border-l-2 border-accent pl-5">
                                {note}
                            </p>
                        </section>
                    ) : (
                        <span />
                    )}

                    <div className="space-y-3 lg:justify-self-end lg:text-right">
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 border border-foreground bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-85 transition-opacity"
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
                                className="index-label flex items-center gap-1.5 hover:text-foreground transition-colors lg:justify-end"
                                aria-label={`${githubLabel} (${opensInNewTab})`}
                            >
                                <GithubLogoIcon className="h-3.5 w-3.5" weight="regular" />
                                GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section className="mt-16" aria-labelledby="related-tools-heading">
                    <h2 id="related-tools-heading" className="serif-display text-2xl text-foreground mb-6">
                        {relatedLabel}
                    </h2>
                    <ul className="grid gap-6 sm:grid-cols-3">
                        {related.map((item) => {
                            const RelatedIcon = getIcon(item.icon)
                            const relatedName = item.name[lang] || item.name.en
                            const relatedPreview = `/previews/${item.id}.png`
                            const showImg = !relatedImgError[item.id]
                            return (
                                <li key={item.id} className="border border-border bg-card">
                                    <Link href={getToolPath(item.id)} className="group flex flex-col h-full">
                                        <div className="relative h-28 bg-muted overflow-hidden border-b border-border">
                                            {showImg ? (
                                                <img
                                                    src={relatedPreview}
                                                    alt=""
                                                    width={320}
                                                    height={112}
                                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                                                    loading="lazy"
                                                    onError={() =>
                                                        setRelatedImgError((prev) => ({ ...prev, [item.id]: true }))
                                                    }
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-full items-center justify-center"
                                                    style={{ backgroundColor: `${item.color}18` }}
                                                >
                                                    <RelatedIcon
                                                        className="h-8 w-8"
                                                        style={{ color: item.color }}
                                                        weight="duotone"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <p className="serif-display text-lg text-foreground truncate group-hover:underline underline-offset-4">
                                                {relatedName}
                                            </p>
                                            <p className="index-label mt-1 truncate">
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
