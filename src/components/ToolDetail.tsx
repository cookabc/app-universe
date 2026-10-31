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
import { DrawerFront } from '@/components/DrawerFront'
import { normalizeLanguage } from '@/components/I18nProvider'
import { LabelRows } from '@/components/LabelRows'
import { ToolPreviewImage } from '@/components/ToolPreviewImage'
import type { Tool } from '@/data/tools'
import { WORKFLOWS } from '@/data/workflow'
import { useI18nReady } from '@/hooks/useI18nReady'
import { drawerOf, drawersInStage, stageLetter } from '@/lib/drawers'
import { getDomain } from '@/lib/filter-tools'
import { copyCanvasAsImage, renderNoteCard } from '@/lib/note-card-image'

export function ToolDetail({ tool }: { tool: Tool }) {
    const { i18n, t } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const [copied, setCopied] = useState(false)
    const [imageState, setImageState] = useState<'idle' | 'rendering' | 'done'>('idle')

    const drawer = drawerOf(tool.id)
    const stage = drawer?.stage ?? 0
    const flow = WORKFLOWS[stage]
    const name = tool.name[lang] || tool.name.en
    const note = tool.note?.[lang] || tool.note?.en
    const domain = getDomain(tool.url)
    const siblings = drawersInStage(stage).filter((entry) => entry.tool.id !== tool.id)

    const copyNote = async () => {
        if (!note) return
        try {
            await navigator.clipboard.writeText(`${name} — ${note}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard unavailable; the note is visible on the page.
        }
    }

    const copyImage = async () => {
        if (!note || imageState === 'rendering') return
        setImageState('rendering')
        try {
            const canvas = await renderNoteCard({
                name,
                note,
                domain,
                code: drawer?.code ?? '',
                label: t('detail.whyIUseIt'),
                attributionLabel: t('detail.curatorAttribution', { domain }).split(/[,，]/)[0].trim(),
                color: tool.color,
                brand: 'Wayseeker',
            })
            await copyCanvasAsImage(canvas, `${tool.id}-label.png`)
            setImageState('done')
            setTimeout(() => setImageState('idle'), 2000)
        } catch {
            setImageState('idle')
        }
    }

    return (
        <article className="wrap label-page">
            <Link href={`/?tool=${tool.id}#cabinet`} className="back-link caps">
                <ArrowLeftIcon weight="bold" />
                {t('detail.back')}
            </Link>

            <div className="label-page-grid">
                <div className="big-label">
                    <div className="big-label-head caps">
                        <span className="code">{drawer?.code}</span>
                        <span>
                            {t('detail.column', { letter: stageLetter(stage) })} · {flow?.name[lang]}
                        </span>
                    </div>
                    <h1 className="display big-label-name">{name}</h1>
                    <p className="big-label-domain code">{domain}</p>
                    <p className="big-label-desc">{tool.description[lang]}</p>
                    <LabelRows tool={tool} lang={lang} />
                    <div className="big-label-actions">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn--ink">
                            {t('counter.visit')}
                            <ArrowSquareOutIcon weight="bold" />
                            <span className="sr-only">({t('counter.opensInNewTab')})</span>
                        </a>
                        <button type="button" className="btn btn--line" onClick={copyNote} aria-live="polite">
                            {copied ? <CheckIcon weight="bold" /> : <CopyIcon weight="bold" />}
                            {copied ? t('detail.noteCopied') : t('detail.copyNote')}
                        </button>
                        <button
                            type="button"
                            className="btn btn--quiet"
                            onClick={copyImage}
                            disabled={imageState === 'rendering'}
                            aria-live="polite"
                        >
                            {imageState === 'done' ? <CheckIcon weight="bold" /> : <ImageIcon weight="bold" />}
                            {imageState === 'done' ? t('detail.imageDone') : t('detail.copyImage')}
                        </button>
                        {tool.githubUrl && (
                            <a
                                href={tool.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn--quiet"
                            >
                                <GithubLogoIcon weight="bold" />
                                {t('detail.github')}
                            </a>
                        )}
                    </div>
                </div>

                <figure className="label-page-shot">
                    <div className="label-page-shot-frame">
                        <ToolPreviewImage
                            tool={tool}
                            eager
                            sizes="(min-width: 1024px) 720px, 100vw"
                            alt={t('counter.previewAlt', { name })}
                        />
                    </div>
                    <figcaption className="label-page-shot-cap code">
                        <span>{domain}</span>
                        <span>{drawer?.code}</span>
                    </figcaption>
                </figure>
            </div>

            {siblings.length > 0 && (
                <section className="shelf" aria-labelledby="shelf-column">
                    <h2 id="shelf-column" className="display shelf-title">
                        {t('detail.sameColumn')}
                    </h2>
                    <ul className="shelf-row">
                        {siblings.map((entry) => (
                            <li key={entry.tool.id}>
                                <DrawerFront drawer={entry} lang={lang} href={`/t/${entry.tool.id}`} />
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </article>
    )
}
