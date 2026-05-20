'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, LayoutGrid, Palette, TrendingUp, Zap } from 'lucide-react'
import { TOOL_CATEGORIES, default as TOOLS } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

const categoryIcons = [
    { icon: TrendingUp, color: '#ef4444', key: 'finance' },
    { icon: Palette, color: '#ec4899', key: 'design' },
    { icon: Zap, color: '#f97316', key: 'productivity' },
    { icon: LayoutGrid, color: '#eab308', key: 'resources' },
]

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
}

export default function HeroSection() {
    const { t, i18n, isReady } = useI18nReady()
    const lang = i18n.language as 'en' | 'zh'
    const shouldReduceMotion = useReducedMotion()

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

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 sm:py-16 lg:py-20"
                variants={shouldReduceMotion ? undefined : containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left Content */}
                <div className="space-y-6 sm:space-y-8">
                    <motion.div className="space-y-4" variants={shouldReduceMotion ? undefined : itemVariants}>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black font-heading tracking-tight text-foreground leading-[1.1]">
                            {title} <span className="text-gradient">{titleAccent}</span>
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                        variants={shouldReduceMotion ? undefined : itemVariants}
                    >
                        <a
                            href="#tools"
                            className="group inline-flex items-center gap-2 px-5 py-3 border-2 border-slate-800 bg-foreground text-background font-bold text-sm rounded-[var(--radius)] shadow-[var(--box-shadow)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[calc(var(--box-shadow)_+_4px)]"
                        >
                            {ctaText}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </a>

                        {/* Stats */}
                        <div className="flex items-center gap-3">
                            <span className="glass-card px-3 py-1.5 text-xs font-bold text-foreground">
                                {statsTools}
                            </span>
                            <span className="glass-card px-3 py-1.5 text-xs font-bold text-foreground">
                                {statsCategories}
                            </span>
                        </div>
                    </motion.div>

                    {/* Category pills preview */}
                    <motion.div
                        className="flex flex-wrap gap-2"
                        variants={shouldReduceMotion ? undefined : itemVariants}
                    >
                        {TOOL_CATEGORIES.filter((c) => c.key !== 'all').map((cat) => {
                            const catIcon = categoryIcons.find((ci) => ci.key === cat.key)
                            const Icon = catIcon?.icon ?? LayoutGrid
                            const label = cat.label[lang] || cat.label.en
                            return (
                                <span
                                    key={cat.key}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border-2 border-slate-800 shadow-[var(--box-shadow)]"
                                    style={{
                                        backgroundColor: `${cat.color}15`,
                                        color: cat.color,
                                    }}
                                >
                                    <Icon className="h-3 w-3" />
                                    {label}
                                </span>
                            )
                        })}
                    </motion.div>
                </div>

                {/* Right: Tool Cards Preview */}
                <motion.div className="relative" variants={shouldReduceMotion ? undefined : itemVariants}>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Decorative tool cards matching the existing ToolCard style */}
                        {[
                            {
                                name: 'getdesign.md',
                                desc: 'DESIGN.md collection for AI agents',
                                icon: '🎨',
                                color: '#1b365d',
                            },
                            {
                                name: 'K2AI',
                                desc: 'AI civilization investment terminal',
                                icon: '🧠',
                                color: '#8b5cf6',
                            },
                            {
                                name: 'Kami',
                                desc: 'Warm parchment design system',
                                icon: '📝',
                                color: '#8b7355',
                            },
                            {
                                name: 'Neal.fun',
                                desc: 'Games, interactives & weird stuff',
                                icon: '✨',
                                color: '#f43f5e',
                            },
                        ].map((card) => (
                            <div key={card.name} className="glass-card p-3 sm:p-4 cursor-default">
                                <div className="flex items-start gap-2.5">
                                    <div
                                        className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm"
                                        style={{ backgroundColor: card.color }}
                                    >
                                        {card.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
                                            {card.name}
                                        </h3>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                            {card.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
