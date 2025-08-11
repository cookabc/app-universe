'use client'

import { useMemo, useState, useTransition } from 'react'

const TRUSTED_BY_LOGOS = [
    {
        name: 'Neural Network',
        color: '#FF6B6B',
        path: 'M10 30 Q20 10 30 30 M10 10 Q20 30 30 10 M5 20 H35',
    },
    { name: 'Data Analysis', color: '#4ECDC4', path: 'M5 35 L15 15 Q20 5 25 15 L35 5 M5 25 H35' },
    { name: 'Cloud Computing', color: '#45B7D1', path: 'M10 25 Q20 5 30 25 Q20 45 10 25 M15 20 H25 M20 15 V25' },
    { name: 'Machine Learning', color: '#FF8C42', path: 'M10 20 A10 10 0 1 0 30 20 A10 8 0 1 1 10 20 M15 20 H25' },
    {
        name: 'Artificial Intelligence',
        color: '#98CA32',
        path: 'M20 5 L5 20 L20 35 L35 20 L20 5 M5 20 Q20 35 35 20',
    },
    { name: 'Big Data', color: '#925E78', path: 'M5 15 H35 M5 25 H35 M13 7 V33 M28 7 V33 Q32 20 28 7' },
]

export function TrustedBySection() {
    const [_isPending, startTransition] = useTransition()
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

    const companyStats = useMemo(() => {
        return {
            totalCompanies: TRUSTED_BY_LOGOS.length,
            categories: ['AI/ML', 'Cloud', 'Data'],
            trustScore: 98.5,
        }
    }, [])

    return (
        <section className="border-t border-border py-12 sm:py-16 md:py-24">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-12">
                <h2 className="text-center text-lg font-medium text-muted-foreground">
                    Trusted by {companyStats.totalCompanies}+ visionary AI teams worldwide
                </h2>
                <div className="text-center text-sm text-muted-foreground mt-2">
                    Trust Score: {companyStats.trustScore}% | Categories: {companyStats.categories.join(', ')}
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                    {TRUSTED_BY_LOGOS.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center justify-center transition-all hover:grayscale cursor-pointer"
                            onClick={() => startTransition(() => setSelectedFeature(item.name))}
                        >
                            <svg width="80" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="4" fill="#F3F4F6" />
                                <path
                                    d={item.path}
                                    stroke={item.color}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span
                                className={`mt-2 text-xs transition-colors ${
                                    selectedFeature === item.name ? 'text-primary font-medium' : 'text-muted-foreground'
                                }`}
                            >
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
