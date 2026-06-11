'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { TOOL_CATEGORIES, default as TOOLS } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { HeroOrbital } from './HeroOrbital'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' as const },
    },
}

export default function HeroSection() {
    const { t, isReady } = useI18nReady()

    const title = isReady ? t('hero.title') : 'Discover tools that'
    const titleAccent = isReady ? t('hero.titleAccent') : 'actually work'
    const subtitle = isReady
        ? t('hero.subtitle')
        : 'A curated collection of apps and tools I use and build — for design, finance, productivity, and more.'
    const ctaText = isReady ? t('hero.cta') : 'Explore tools'
    const toolCount = TOOLS.length
    const categoryCount = TOOL_CATEGORIES.filter((c) => c.key !== 'all').length
    const statsTools = isReady ? t('hero.statsTools', { count: toolCount }) : `${toolCount}+ tools`
    const statsCategories = isReady
        ? t('hero.statsCategories', { count: categoryCount })
        : `${categoryCount} categories`

    const shouldReduceMotion = useReducedMotion()

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
                className="flex flex-col items-center text-center py-8 sm:py-10"
                variants={shouldReduceMotion ? undefined : containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Title */}
                <motion.div className="space-y-2" variants={shouldReduceMotion ? undefined : itemVariants}>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-foreground leading-[1.08]">
                        {title}
                        <br />
                        <span className="text-gradient">{titleAccent}</span>
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="flex items-center justify-center gap-3 flex-wrap mt-5"
                    variants={shouldReduceMotion ? undefined : itemVariants}
                >
                    <a
                        href="#tools"
                        className="group inline-flex items-center gap-2 px-5 py-2.5 border-2 border-slate-800 bg-foreground text-background font-bold text-sm rounded-[var(--radius)] shadow-[var(--box-shadow)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[calc(var(--box-shadow)_+_4px)]"
                    >
                        {ctaText}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                    <span className="glass-card px-3 py-1.5 text-xs font-bold text-foreground">{statsTools}</span>
                    <span className="glass-card px-3 py-1.5 text-xs font-bold text-foreground">
                        {statsCategories}
                    </span>
                </motion.div>

                {/* Orbital illustration */}
                <motion.div
                    className="mt-6 w-full max-w-[420px]"
                    variants={shouldReduceMotion ? undefined : itemVariants}
                >
                    <HeroOrbital />
                </motion.div>
            </motion.div>
        </section>
    )
}
