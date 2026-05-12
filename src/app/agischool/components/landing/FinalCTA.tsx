'use client'

/**
 * [INPUT]: 依赖 lucide-react 图标、shadcn/ui Button 组件
 * [OUTPUT]: 对外提供 FinalCTA 最终行动号召组件
 * [POS]: landing/ 的转化组件，页面底部 CTA
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'

export function FinalCTA() {
    const { t } = useTranslation()
    return (
        <section className="w-full py-20 md:py-28 px-4 flex justify-center bg-background-light dark:bg-background-dark">
            <div className="max-w-4xl w-full text-center relative rounded-[var(--radius)] border-2 border-slate-800 bg-card p-8 md:p-12 shadow-[var(--box-shadow)]">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-800 bg-background px-4 py-2 mb-6 shadow-[var(--box-shadow)]">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">
                        {t('agischool.cta.badge')}
                    </span>
                </div>

                {/* Heading */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-text-main dark:text-white mb-6">
                    {t('agischool.cta.title')}
                    <span className="block text-primary mt-2">{t('agischool.cta.subtitle')}</span>
                </h2>

                {/* Description */}
                <p className="text-lg text-text-muted dark:text-gray-400 max-w-2xl mx-auto mb-8">
                    {t('agischool.cta.description')}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button variant="default" size="lg" className="gap-2 h-14 px-8 text-base rounded-xl">
                        <span>{t('agischool.cta.primaryButton')}</span>
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-xl">
                        {t('agischool.cta.secondaryButton')}
                    </Button>
                </div>

                {/* Trust Badge */}
                <p className="text-sm text-text-muted dark:text-gray-500 mt-8">{t('agischool.cta.trust')}</p>
            </div>
        </section>
    )
}
