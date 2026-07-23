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
    const recordLabel = isReady ? t('toolDetail.recordLabel', { id: tool.id }) : `Archive record · ${tool.id}`
    const relatedEyebrow = isReady ? t('toolDetail.relatedEyebrow') : 'Keep exploring'

    const tagLabel = (tag: string) => {
        if (isReady) {
            const key = `tags.${tag}`
            const translated = t(key)
            if (translated !== key) return translated
        }
        return formatTag(tag)
    }

    return (
        <article className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
            <Link
                href="/#tools"
                className="index-label index-label--foreground mb-10 inline-flex min-h-11 items-center gap-2 border-b-2 border-foreground hover:border-primary hover:text-primary transition-colors"
            >
                <ArrowLeftIcon className="h-3.5 w-3.5" weight="bold" />
                {backLabel}
            </Link>

            <section className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
                <div className="min-w-0 lg:col-span-5 lg:sticky lg:top-24">
                    <p className="index-label index-label--accent mb-5">{recordLabel}</p>
                    <h1 className="display-heading max-w-full text-[clamp(2.75rem,4vw,4rem)] leading-[0.96] tracking-[-0.045em] text-foreground [overflow-wrap:anywhere]">
                        {name}
                    </h1>
                    <p className="measure mt-6 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                        {desc}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-2">
                        {tool.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/?tag=${encodeURIComponent(tag)}#tools`}
                                className="index-label index-label--accent-foreground inline-flex min-h-11 items-center border border-foreground bg-accent px-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                                {tagLabel(tag)}
                            </Link>
                        ))}
                    </div>
                    {note ? (
                        <section
                            className="mt-10 border-l-4 border-[hsl(var(--signal))] bg-card p-5"
                            aria-labelledby="why-heading"
                        >
                            <h2 id="why-heading" className="index-label index-label--signal mb-3">
                                {whyLabel}
                            </h2>
                            <p className="text-base leading-relaxed text-foreground/90 text-pretty">{note}</p>
                        </section>
                    ) : null}
                </div>

                <div className="signal-card overflow-hidden lg:col-span-7">
                    <div className="flex flex-col gap-4 border-b-2 border-foreground p-4 sm:flex-row sm:items-center sm:justify-between">
                        <span className="index-label index-label--primary">{domain}</span>
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="signal-button inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3"
                        >
                            {openExternal}
                            <ArrowSquareOutIcon className="h-4 w-4" weight="bold" />
                            <span className="sr-only">({opensInNewTab})</span>
                        </a>
                    </div>
                    <div className="relative overflow-hidden bg-muted">
                        {!imgError ? (
                            <img
                                src={previewSrc}
                                alt={isReady ? t('toolsWall.previewAlt', { name }) : `${name} preview`}
                                width={1200}
                                height={675}
                                className="aspect-video w-full object-cover object-top"
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
                    {tool.githubUrl && (
                        <div className="border-t border-border p-4">
                            <a
                                href={tool.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="index-label index-label--foreground inline-flex min-h-11 items-center gap-2 border-b-2 border-foreground hover:border-primary hover:text-primary transition-colors"
                                aria-label={`${githubLabel} (${opensInNewTab})`}
                            >
                                <GithubLogoIcon className="h-3.5 w-3.5" weight="regular" />
                                GitHub
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {related.length > 0 && (
                <section className="mt-20" aria-labelledby="related-tools-heading">
                    <div className="mb-7 flex items-end justify-between border-b-2 border-foreground pb-3">
                        <div>
                            <p className="index-label index-label--accent mb-2">{relatedEyebrow}</p>
                            <h2 id="related-tools-heading" className="display-heading text-3xl text-foreground">
                                {relatedLabel}
                            </h2>
                        </div>
                    </div>
                    <ul className="grid gap-6 sm:grid-cols-3">
                        {related.map((item) => {
                            const RelatedIcon = getIcon(item.icon)
                            const relatedName = item.name[lang] || item.name.en
                            const relatedPreview = `/previews/${item.id}.png`
                            const showImg = !relatedImgError[item.id]
                            return (
                                <li
                                    key={item.id}
                                    className="tool-card-lift overflow-hidden border-2 border-foreground bg-card"
                                >
                                    <Link href={getToolPath(item.id)} className="group flex flex-col h-full">
                                        <div className="relative aspect-[16/9] bg-muted overflow-hidden border-b-2 border-foreground">
                                            {showImg ? (
                                                <img
                                                    src={relatedPreview}
                                                    alt=""
                                                    width={320}
                                                    height={112}
                                                    className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.02]"
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
                                            <p className="display-heading text-lg text-foreground truncate group-hover:text-primary transition-colors">
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
