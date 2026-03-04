'use client'

import { ArrowRight, PlayCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import { FadeIn } from '../common/FadeIn'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'

export function Hero() {
    const { t } = useTranslation()
    return (
        <section className="w-full bg-background-light dark:bg-background-dark py-20 lg:py-32 px-4 flex justify-center overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-[1200px] w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Left Content */}
                <div className="flex flex-col gap-8">
                    <FadeIn>
                        <Badge
                            variant="secondary"
                            className="inline-flex items-center gap-2 self-start bg-primary/10 text-primary hover:bg-primary/15 border-primary/20 px-4 py-2 rounded-full"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="font-bold tracking-wide">{t('agischool.hero.badge')}</span>
                        </Badge>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-foreground mt-6">
                            {t('agischool.hero.title').split(' with ')[0]} <br />
                            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">AGI School</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-[540px] leading-relaxed mt-4">
                            {t('agischool.hero.subtitle')}
                        </p>
                    </FadeIn>

                    {/* CTA Buttons */}
                    <FadeIn delay={0.2}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
                                {t('agischool.hero.cta')}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-muted/50">
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
                    <div className="relative aspect-square md:aspect-[4/3] rounded-[40px] bg-gradient-to-br from-primary/10 to-purple-500/10 border border-white/20 backdrop-blur-sm p-2 shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105" />

                        {/* Floating Cards Mockup */}
                        <div className="absolute bottom-8 left-8 right-8 bg-background/80 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                                    98%
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">{t('agischool.hero.completionRate')}</h4>
                                    <p className="text-sm text-muted-foreground">{t('agischool.hero.completionRateDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
