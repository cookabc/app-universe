import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FEATURES, type Feature } from './constants'

interface FeatureIconProps {
    color: string
}

function FeatureIcon({ color }: FeatureIconProps) {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="8" fill={`${color}20`} />
            <path
                d="M24 12L36 18V30L24 36L12 30V18L24 12Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M24 18L30 21V27L24 30L18 27V21L24 18Z" fill={color} />
        </svg>
    )
}

interface FeatureCardProps {
    feature: Feature
}

function FeatureCard({ feature }: FeatureCardProps) {
    return (
        <div
            className={`${feature.bgColor} flex flex-col items-start rounded-[15px] border border-[#19192c] p-6 sm:p-8`}
        >
            <div className="mb-4">
                <FeatureIcon color={feature.iconColor} />
            </div>
            <h3 className="mb-2 text-lg sm:text-xl font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
    )
}

export function FeaturesSection() {
    return (
        <section className="py-12 sm:py-16 md:py-24">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-12">
                <div className="flex flex-col items-start gap-4">
                    <h2 className="max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tighter">
                        Accelerate time to market
                        <br />
                        for your business-critical
                        <br />
                        <span className="text-[#a78bfa]">Video Analytics Pipeline</span>
                    </h2>
                    <Link
                        href="#"
                        className="inline-flex items-center rounded-full bg-[#bbf7d0] px-4 py-1.5 text-sm font-medium text-[#064e3b] transition-colors hover:bg-[#86efac] border border-[#19192c]"
                    >
                        Explore More
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
                <div className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((feature) => (
                        <FeatureCard key={feature.title} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    )
}
