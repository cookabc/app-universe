'use client'

import Link from 'next/link'
import { normalizeLanguage } from '@/components/I18nProvider'
import { ToolPreviewImage } from '@/components/ToolPreviewImage'
import { getAllTags, getToolPath, default as TOOLS } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { getDomain } from '@/lib/filter-tools'

export default function Hero() {
    const { i18n, t, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)
    const [lead, secondary, tertiary] = TOOLS
    if (!lead || !secondary || !tertiary) return null

    const title = isReady ? t('hero.title') : 'Discover tools that'
    const titleAccent = isReady ? t('hero.titleAccent') : 'earn their place.'
    const subtitle = isReady
        ? t('hero.subtitle')
        : 'A hand-curated field guide for design, code, and creative work—with honest notes on when to use each tool.'
    const eyebrow = isReady ? t('hero.eyebrow') : 'Human-curated field guide'
    const cta = isReady ? t('hero.cta') : 'Explore the archive'
    const toolsLabel = isReady ? t('hero.statsTools', { count: TOOLS.length }) : `${TOOLS.length} tools`
    const tagsLabel = isReady
        ? t('hero.statsTags', { count: getAllTags(TOOLS).length })
        : `${getAllTags(TOOLS).length} tags`
    const leadName = lead.name[lang] || lead.name.en
    const secondaryName = secondary.name[lang] || secondary.name.en
    const tertiaryName = tertiary.name[lang] || tertiary.name.en

    return (
        <section className="atlas-hero" aria-labelledby="atlas-title">
            <div className="atlas-orbit atlas-orbit-one" aria-hidden="true" />
            <div className="atlas-orbit atlas-orbit-two" aria-hidden="true" />
            <div className="container atlas-hero-inner max-w-7xl mx-auto px-4">
                <div className="atlas-hero-copy">
                    <div className="atlas-eyebrow-row">
                        <span className="atlas-pulse" aria-hidden="true" />
                        <p>{eyebrow}</p>
                        <span className="atlas-edition">VOL. 01 / {String(TOOLS.length).padStart(2, '0')}</span>
                    </div>
                    <h1 id="atlas-title" className="atlas-title">
                        <span>{title}</span>
                        <em>{titleAccent}</em>
                    </h1>
                    <p className="atlas-intro">{subtitle}</p>
                    <div className="atlas-hero-actions">
                        <a href="#tools" className="atlas-cta">
                            {cta}
                            <span aria-hidden="true">↗</span>
                        </a>
                        <span className="atlas-scroll-note">
                            {lang === 'zh' ? '向下浏览精选索引' : 'SCROLL TO EXPLORE'}
                        </span>
                    </div>
                    <div className="atlas-facts">
                        <span>{toolsLabel}</span>
                        <span>{tagsLabel}</span>
                        <span>{lang === 'zh' ? '中英双语' : 'Bilingual'}</span>
                    </div>
                </div>

                <div className="atlas-showcase">
                    <div className="atlas-showcase-top">
                        <span>INDEX / 001</span>
                        <span>APP UNIVERSE ©</span>
                    </div>
                    <Link href={getToolPath(lead.id)} className="atlas-lead-image group" aria-label={leadName}>
                        <ToolPreviewImage
                            tool={lead}
                            sizes="(min-width: 1024px) 580px, 100vw"
                            eager
                            className="transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <span className="atlas-image-index" aria-hidden="true">
                            01 / {String(TOOLS.length).padStart(2, '0')}
                        </span>
                    </Link>
                    <div className="atlas-lead-caption">
                        <div>
                            <span className="atlas-meta">{lang === 'zh' ? '本期首选' : 'THE FIRST FIND'}</span>
                            <Link href={getToolPath(lead.id)}>
                                {leadName} <span aria-hidden="true">↗</span>
                            </Link>
                        </div>
                        <span className="atlas-meta">{getDomain(lead.url)}</span>
                    </div>
                    <div className="atlas-mini-grid">
                        {[secondary, tertiary].map((tool, index) => {
                            const name = index === 0 ? secondaryName : tertiaryName
                            return (
                                <Link key={tool.id} href={getToolPath(tool.id)} className="atlas-mini group">
                                    <span className="atlas-mini-image">
                                        <ToolPreviewImage
                                            tool={tool}
                                            sizes="(min-width: 1024px) 240px, 45vw"
                                            eager
                                            className="transition-transform duration-500 group-hover:scale-[1.06]"
                                        />
                                    </span>
                                    <span className="atlas-mini-name">
                                        <span className="atlas-meta">0{index + 2}</span>
                                        {name}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="atlas-hero-foot" aria-hidden="true">
                <span>SELECTED FOR USE, NOT JUST FOR LOOKS</span>
                <span>✳</span>
                <span>DESIGN / CODE / CREATIVE WORK</span>
                <span>✳</span>
                <span>SELECTED FOR USE, NOT JUST FOR LOOKS</span>
            </div>
        </section>
    )
}
