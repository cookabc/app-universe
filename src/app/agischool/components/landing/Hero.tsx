'use client'

import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FadeIn } from '../common/FadeIn'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

export function Hero() {
    const { t, i18n } = useTranslation()
    const title = t('agischool.hero.title')
    const titleBrand = ['AGI School', 'AGI 学校'].find((brand) => title.includes(brand)) ?? ''
    const [titleBefore, titleAfter = ''] = titleBrand ? title.split(titleBrand) : [title, '']

    if (!i18n.isInitialized) {
        return (
            <section className="w-full bg-background-light dark:bg-background-dark py-20 lg:py-32 px-4 flex justify-center overflow-hidden relative">
                <div className="max-w-[1200px] w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="flex flex-col gap-8">
                        <div className="h-10 w-40 bg-muted animate-pulse rounded-full" />
                        <div className="h-20 w-full bg-muted animate-pulse rounded-lg" />
                        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="hidden lg:block aspect-square rounded-[40px] bg-muted animate-pulse" />
                </div>
            </section>
        )
    }

    return (
        <section className="w-full bg-background-light dark:bg-background-dark py-20 lg:py-32 px-4 flex justify-center overflow-hidden relative">
            <div className="max-w-[1200px] w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Left Content */}
                <div className="flex flex-col gap-8">
                    <FadeIn delay={0}>
                        <Badge
                            variant="secondary"
                            className="inline-flex items-center gap-2 self-start bg-primary/10 text-primary hover:bg-primary/15 border-primary/20 px-4 py-2 rounded-full"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="font-bold tracking-wide">{t('agischool.hero.badge')}</span>
                        </Badge>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-foreground mt-6">
                            {titleBefore}
                            {titleBrand ? <span className="text-primary">{titleBrand}</span> : null}
                            {titleAfter}
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-[540px] leading-relaxed mt-4">
                            {t('agischool.hero.subtitle')}
                        </p>
                    </FadeIn>

                    {/* CTA Buttons */}
                    <FadeIn delay={0.2}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1"
                            >
                                {t('agischool.hero.cta')}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 rounded-full text-lg border-2 hover:bg-muted/50"
                            >
                                <PlayCircle className="w-5 h-5 mr-2" />
                                {t('agischool.hero.demo')}
                            </Button>
                        </div>

                        <div className="flex items-center gap-6 mt-8 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>{t('agischool.hero.noCreditCard')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>{t('agischool.hero.freeTrial')}</span>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Right 3D Visual */}
                <FadeIn delay={0.4} className="relative">
                    <div className="relative aspect-square md:aspect-[4/3] rounded-[var(--radius)] bg-card border-2 border-slate-800 shadow-[var(--box-shadow)] p-6 overflow-hidden group">
                        <div className="flex h-full flex-col rounded-[calc(var(--radius)_-_0.25rem)] border-2 border-slate-800 bg-background p-5">
                            <div className="mb-5 flex items-center justify-between">
                                <div className="h-3 w-28 rounded-full bg-primary" />
                                <div className="flex gap-2">
                                    <span className="h-3 w-3 rounded-full bg-border" />
                                    <span className="h-3 w-3 rounded-full bg-border" />
                                    <span className="h-3 w-3 rounded-full bg-border" />
                                </div>
                            </div>
                            <div className="grid flex-1 grid-cols-[0.85fr_1.15fr] gap-4">
                                <div className="space-y-3">
                                    <div className="h-10 rounded-lg border-2 border-slate-800 bg-primary/10" />
                                    <div className="h-10 rounded-lg border border-border bg-muted" />
                                    <div className="h-10 rounded-lg border border-border bg-muted" />
                                    <div className="h-10 rounded-lg border border-border bg-muted" />
                                </div>
                                <div className="rounded-xl border-2 border-slate-800 bg-card p-4">
                                    <div className="mb-4 h-4 w-3/4 rounded-full bg-foreground" />
                                    <div className="space-y-3">
                                        <div className="h-3 rounded-full bg-muted" />
                                        <div className="h-3 w-5/6 rounded-full bg-muted" />
                                        <div className="h-3 w-2/3 rounded-full bg-muted" />
                                    </div>
                                    <div className="mt-8 grid grid-cols-2 gap-3">
                                        <div className="aspect-square rounded-lg border border-border bg-primary/10" />
                                        <div className="aspect-square rounded-lg border border-border bg-accent/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
