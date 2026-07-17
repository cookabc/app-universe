'use client'

import { ArrowRightIcon } from '@phosphor-icons/react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { getAllTags, default as TOOLS } from '@/data/tools'
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
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
}

export default function HeroSection() {
    const { t, isReady } = useI18nReady()

    const title = isReady ? t('hero.title') : 'Discover tools that'
    const titleAccent = isReady ? t('hero.titleAccent') : 'actually work'
    const subtitle = isReady
        ? t('hero.subtitle')
        : 'A curated collection of apps and tools I actually use — for design, productivity, and more.'
    const ctaText = isReady ? t('hero.cta') : 'Explore tools'
    const toolCount = TOOLS.length
    const tagCount = getAllTags(TOOLS).length
    const statsTools = isReady ? t('hero.statsTools', { count: toolCount }) : `${toolCount}+ tools`
    const statsTags = isReady ? t('hero.statsTags', { count: tagCount }) : `${tagCount} tags`

    const shouldReduceMotion = useReducedMotion()

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-12 sm:py-20"
                variants={shouldReduceMotion ? undefined : containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left: text */}
                <div className="flex-1 min-w-0 text-center lg:text-left">
                    <motion.div className="space-y-4" variants={shouldReduceMotion ? undefined : itemVariants}>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-[-0.03em] text-foreground leading-[1.05] text-balance">
                            {title}
                            <br />
                            <span className="font-serif italic text-foreground">{titleAccent}</span>
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed text-pretty">
                            {subtitle}
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex items-center justify-center lg:justify-start gap-3 flex-wrap mt-6"
                        variants={shouldReduceMotion ? undefined : itemVariants}
                    >
                        <a
                            href="#tools"
                            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-inner)] bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-all duration-200 active:translate-y-px active:scale-[0.98]"
                        >
                            {ctaText}
                            <ArrowRightIcon
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                weight="bold"
                            />
                        </a>
                        <span className="surface radius-inner px-3 py-1.5 text-xs font-medium text-foreground">
                            {statsTools}
                        </span>
                        <span className="surface radius-inner px-3 py-1.5 text-xs font-medium text-foreground">
                            {statsTags}
                        </span>
                    </motion.div>
                </div>

                {/* Right: orbital */}
                <motion.div
                    className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] flex-shrink-0"
                    variants={shouldReduceMotion ? undefined : itemVariants}
                >
                    <HeroOrbital />
                </motion.div>
            </motion.div>
        </section>
    )
}
