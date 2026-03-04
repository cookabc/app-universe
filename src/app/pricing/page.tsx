import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export default function PricingPage() {
    const { t } = useTranslation()
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">{t('pricing.title')}</h2>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground">{t('pricing.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{t('pricing.plans.free.name')}</CardTitle>
                        <CardDescription>{t('pricing.plans.free.description')}</CardDescription>
                        <p className="text-4xl font-bold mt-4">
                            {t('pricing.plans.free.price')}<span className="text-lg font-normal">{t('pricing.plans.free.period')}</span>
                        </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-2">
                            {(t('pricing.plans.free.features', { returnObjects: true }) as string[]).map((feature: string, i: number) => (
                                <li key={i} className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">{t('pricing.plans.free.cta')}</Button>
                    </CardFooter>
                </Card>

                <Card className="border-primary flex flex-col">
                    <CardHeader>
                        <CardTitle>{t('pricing.plans.pro.name')}</CardTitle>
                        <CardDescription>{t('pricing.plans.pro.description')}</CardDescription>
                        <p className="text-4xl font-bold mt-4">
                            {t('pricing.plans.pro.price')}<span className="text-lg font-normal">{t('pricing.plans.pro.period')}</span>
                        </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-2">
                            {(t('pricing.plans.pro.features', { returnObjects: true }) as string[]).map((feature: string, i: number) => (
                                <li key={i} className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="default">
                            {t('pricing.plans.pro.cta')}
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{t('pricing.plans.team.name')}</CardTitle>
                        <CardDescription>{t('pricing.plans.team.description')}</CardDescription>
                        <p className="text-4xl font-bold mt-4">
                            {t('pricing.plans.team.price')}<span className="text-lg font-normal">{t('pricing.plans.team.period')}</span>
                        </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-2">
                            {(t('pricing.plans.team.features', { returnObjects: true }) as string[]).map((feature: string, i: number) => (
                                <li key={i} className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">{t('pricing.plans.team.cta')}</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
