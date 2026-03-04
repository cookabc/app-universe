import { Check, X, Sparkles, Zap, Shield, Rocket } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '../common/FadeIn'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { useTranslation } from 'react-i18next'

export function FeatureMatrix() {
    const { t } = useTranslation()
    const plans = [
        {
            name: t('agischool.features.plans.free.name'),
            price: t('agischool.features.plans.free.price'),
            period: t('agischool.features.plans.free.period'),
            desc: t('agischool.features.plans.free.desc'),
            features: t('agischool.features.plans.free.features', { returnObjects: true }) as string[],
            cta: t('agischool.features.plans.free.cta'),
            popular: false,
            color: 'border-border/50',
        },
        {
            name: t('agischool.features.plans.pro.name'),
            price: t('agischool.features.plans.pro.price'),
            period: t('agischool.features.plans.pro.period'),
            desc: t('agischool.features.plans.pro.desc'),
            features: t('agischool.features.plans.pro.features', { returnObjects: true }) as string[],
            cta: t('agischool.features.plans.pro.cta'),
            popular: true,
            color: 'border-primary shadow-2xl shadow-primary/20 scale-105 z-10',
        },
        {
            name: t('agischool.features.plans.enterprise.name'),
            price: t('agischool.features.plans.enterprise.price'),
            period: t('agischool.features.plans.enterprise.period'),
            desc: t('agischool.features.plans.enterprise.desc'),
            features: t('agischool.features.plans.enterprise.features', { returnObjects: true }) as string[],
            cta: t('agischool.features.plans.enterprise.cta'),
            popular: false,
            color: 'border-border/50',
        },
    ]

    return (
        <section className="w-full bg-background-light dark:bg-background-dark py-20 px-4 flex justify-center">
            <div className="max-w-[1200px] w-full flex flex-col gap-16">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                        {t('agischool.features.badge')}
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-black text-text-main dark:text-white">
                        {t('agischool.features.title')}
                    </h2>
                    <p className="text-lg text-text-muted dark:text-gray-400">
                        {t('agischool.features.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-card rounded-2xl border p-8 flex flex-col gap-6 h-full transition-transform hover:-translate-y-2 duration-300 ${plan.color}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    {t('agischool.features.mostPopular')}
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-foreground">{plan.price}</span>
                                    <span className="text-muted-foreground font-medium">{plan.period}</span>
                                </div>
                                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{plan.desc}</p>
                            </div>
                            <div className="flex-1 space-y-4">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm">
                                        <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Check className="size-3 text-primary" />
                                        </div>
                                        <span className="text-foreground/80">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <Button
                                className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                                size="lg"
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
