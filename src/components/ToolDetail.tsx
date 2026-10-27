'use client'

import {
    ArrowLeftIcon,
    ArrowSquareOutIcon,
    CheckIcon,
    CopyIcon,
    GithubLogoIcon,
    ImageIcon,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { CuratorNote } from '@/components/CuratorNote'
import { normalizeLanguage } from '@/components/I18nProvider'
import { ToolPreviewImage } from '@/components/ToolPreviewImage'
import type { Tool } from '@/data/tools'
import { formatToolNumber, getToolNumber, getToolPath } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { useTagLabel } from '@/hooks/useTagLabel'
import { getDomain } from '@/lib/filter-tools'
import { copyCanvasAsImage, renderNoteCard } from '@/lib/note-card-image'

interface ToolDetailProps {
    tool: Tool
    related: Tool[]
}

export function ToolDetail({ tool, related }: ToolDetailProps) {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const tagLabel = useTagLabel()
    const [noteCopied, setNoteCopied] = useState(false)
    const [imageState, setImageState] = useState<'idle' | 'rendering' | 'done'>('idle')

    const name = tool.name[lang] || tool.name.en
    const desc = tool.description[lang] || tool.description.en
    const note = tool.note?.[lang] || tool.note?.en
    const domain = getDomain(tool.url)
    const githubLabel = isReady ? t('toolsWall.githubRepo') : 'GitHub repository'
    const opensInNewTab = isReady ? t('toolsWall.opensInNewTab') : 'opens in a new tab'
    const backLabel = isReady ? t('toolDetail.back') : 'Back to tools'
    const whyLabel = isReady ? t('toolDetail.whyIUseIt') : 'Why I use it'
    const relatedLabel = isReady ? t('toolDetail.related') : 'Related tools'
    const openExternal = isReady ? t('toolDetail.openSite') : 'Open site'
    const recordLabel = isReady ? t('toolDetail.recordLabel', { id: tool.id }) : `Archive record ${tool.id}`
    const relatedEyebrow = isReady ? t('toolDetail.relatedEyebrow') : 'Keep exploring'
    const copyNoteLabel = isReady ? t('toolDetail.copyNote') : 'Copy note'
    const noteCopiedLabel = isReady ? t('toolDetail.noteCopied') : 'Copied'
    const copyImageLabel = isReady ? t('toolDetail.copyImage') : 'Copy as image'
    const imageDoneLabel = isReady ? t('toolDetail.imageDone') : 'Image ready'
    const curatorAttribution = isReady ? t('toolDetail.curatorAttribution', { domain }) : `Curator's note, ${domain}`
    // The label is the part before the domain. Both comma forms are accepted
    // because the two locales punctuate differently.
    const attributionLabel = curatorAttribution.split(/[,，]/)[0].trim()

    const handleCopyNote = async () => {
        if (!note) return
        try {
            await navigator.clipboard.writeText(`${name} — ${note}`)
            setNoteCopied(true)
            setTimeout(() => setNoteCopied(false), 2000)
        } catch {
            // Clipboard unavailable (permissions / non-secure context); keep quiet.
        }
    }

    const handleCopyImage = async () => {
        if (!note || imageState === 'rendering') return
        setImageState('rendering')
        try {
            const canvas = await renderNoteCard({
                name,
                note,
                domain,
                color: tool.color,
                label: whyLabel,
                attributionLabel,
                brand: 'App Universe',
            })
            await copyCanvasAsImage(canvas, `${tool.id}-note.png`)
            setImageState('done')
            setTimeout(() => setImageState('idle'), 2000)
        } catch {
            setImageState('idle')
        }
    }

    return (
        <article className="atlas-detail mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-20">
            <Link
                href="/#tools"
                className="index-label index-label--foreground mb-10 inline-flex min-h-11 items-center gap-2 border-b border-foreground hover:border-primary hover:text-primary transition-colors"
            >
                <ArrowLeftIcon className="h-3.5 w-3.5" weight="bold" />
                {backLabel}
            </Link>

            <section className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
                <div className="min-w-0 lg:col-span-5 lg:sticky lg:top-24">
                    <p className="index-label index-label--accent mb-5">
                        {formatToolNumber(getToolNumber(tool.id))} {recordLabel}
                    </p>
                    <h1 className="atlas-detail-title display-heading max-w-full text-[clamp(2.75rem,4vw,4rem)] leading-[0.96] tracking-[-0.045em] text-foreground [overflow-wrap:anywhere]">
                        {name}
                    </h1>
                    <p className="measure mt-6 text-base leading-relaxed text-muted-foreground text-pretty sm:text-base">
                        {desc}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-2">
                        {tool.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/?tag=${encodeURIComponent(tag)}#tools`}
                                className="atlas-detail-tag index-label index-label--accent-foreground inline-flex min-h-11 items-center border border-foreground bg-accent px-3 hover:bg-[var(--primary-text-fill)] hover:text-primary-foreground transition-colors"
                            >
                                {tagLabel(tag)}
                            </Link>
                        ))}
                    </div>
                    {note ? (
                        <div className="mt-10">
                            <CuratorNote
                                note={note}
                                label={whyLabel}
                                attribution={curatorAttribution}
                                action={
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleCopyNote}
                                            className="index-label index-label--foreground inline-flex min-h-11 items-center gap-1.5 border border-border bg-background px-3 hover:border-foreground transition-colors"
                                            aria-live="polite"
                                        >
                                            {noteCopied ? (
                                                <CheckIcon className="h-3.5 w-3.5" weight="bold" />
                                            ) : (
                                                <CopyIcon className="h-3.5 w-3.5" weight="bold" />
                                            )}
                                            {noteCopied ? noteCopiedLabel : copyNoteLabel}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCopyImage}
                                            disabled={imageState === 'rendering'}
                                            className="index-label inline-flex min-h-11 items-center gap-1.5 border border-foreground bg-foreground px-3 text-background hover:bg-[var(--primary-text-fill)] hover:border-primary disabled:opacity-60 transition-colors"
                                            aria-live="polite"
                                        >
                                            {imageState === 'done' ? (
                                                <CheckIcon className="h-3.5 w-3.5" weight="bold" />
                                            ) : (
                                                <ImageIcon className="h-3.5 w-3.5" weight="bold" />
                                            )}
                                            {imageState === 'done' ? imageDoneLabel : copyImageLabel}
                                        </button>
                                    </div>
                                }
                            />
                        </div>
                    ) : null}
                </div>

                <div className="atlas-detail-media signal-card overflow-hidden lg:col-span-7">
                    <div className="atlas-detail-media-head flex flex-col gap-4 border-b border-foreground p-4 sm:flex-row sm:items-center sm:justify-between">
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
                    <div className="relative aspect-video overflow-hidden bg-muted">
                        <ToolPreviewImage
                            tool={tool}
                            sizes="(min-width: 1024px) 690px, 100vw"
                            alt={isReady ? t('toolsWall.previewAlt', { name }) : `${name} preview`}
                            iconClassName="h-16 w-16"
                        />
                    </div>
                    {tool.githubUrl && (
                        <div className="border-t border-border p-4">
                            <a
                                href={tool.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="index-label index-label--foreground inline-flex min-h-11 items-center gap-2 border-b border-foreground hover:border-primary hover:text-primary transition-colors"
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
                    <div className="mb-7 flex items-end justify-between border-b border-foreground pb-3">
                        <div>
                            <p className="index-label index-label--accent mb-2">{relatedEyebrow}</p>
                            <h2 id="related-tools-heading" className="display-heading text-3xl text-foreground">
                                {relatedLabel}
                            </h2>
                        </div>
                    </div>
                    <ul className="grid gap-6 sm:grid-cols-3">
                        {related.map((item) => {
                            const relatedName = item.name[lang] || item.name.en
                            return (
                                <li
                                    key={item.id}
                                    className="atlas-related-card tool-card-lift overflow-hidden border border-foreground bg-card"
                                >
                                    <Link href={getToolPath(item.id)} className="group flex flex-col h-full">
                                        <div className="relative aspect-[16/9] bg-muted overflow-hidden border-b border-foreground">
                                            <ToolPreviewImage
                                                tool={item}
                                                sizes="(min-width: 640px) 33vw, 100vw"
                                                className="group-hover:scale-[1.02]"
                                                iconClassName="h-8 w-8"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <p className="display-heading text-base text-foreground truncate group-hover:text-primary transition-colors">
                                                {relatedName}
                                            </p>
                                            <p className="index-label mt-1 truncate">
                                                {item.tags.map(tagLabel).join(', ')}
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
