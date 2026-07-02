'use client'

import { MagnifyingGlass } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SearchBar } from '@/components/SearchBar'
import { ToolCard } from '@/components/ToolCard'
import type { Tool } from '@/data/tools'
import tools, { TOOL_CATEGORIES, type ToolCategory } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { getIcon } from '@/lib/icon-map'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const containerReduced = { hidden: { opacity: 1 }, show: { opacity: 1 } }

const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.12 } },
}
const itemReduced = { hidden: { opacity: 1 }, show: { opacity: 1 } }

const sectionVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

export function ToolGrid() {
    const { t, i18n, isReady } = useI18nReady()
    const lang = i18n.language as 'en' | 'zh'
    const shouldReduceMotion = useReducedMotion()

    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')

    const filtered = useMemo(() => {
        let result: Tool[] = tools

        if (activeCategory !== 'all') {
            result = result.filter((t) => t.category === activeCategory)
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            result = result.filter((t) => {
                const nameMatch = t.name.en.toLowerCase().includes(q) || t.name.zh.toLowerCase().includes(q)
                const descMatch =
                    t.description.en.toLowerCase().includes(q) || t.description.zh.toLowerCase().includes(q)
                const tagMatch = t.tags.some((tag) => tag.includes(q))
                const catMatch =
                    TOOL_CATEGORIES.find((c) => c.key === t.category)
                        ?.label.en.toLowerCase()
                        .includes(q) || TOOL_CATEGORIES.find((c) => c.key === t.category)?.label.zh.includes(q)
                return nameMatch || descMatch || tagMatch || catMatch
            })
        }

        return result
    }, [searchQuery, activeCategory])

    const grouped = useMemo(() => {
        if (activeCategory !== 'all' || searchQuery.trim()) return null

        const groups: { category: ToolCategory; tools: Tool[] }[] = []
        for (const cat of TOOL_CATEGORIES) {
            if (cat.key === 'all') continue
            const catTools = filtered.filter((t) => t.category === cat.key)
            if (catTools.length > 0) {
                groups.push({ category: cat, tools: catTools })
            }
        }
        return groups
    }, [filtered, activeCategory, searchQuery])

    return (
        <div className="space-y-5">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter tools={tools} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MagnifyingGlass className="h-12 w-12 text-muted-foreground/40 mb-4" weight="duotone" />
                    <p className="text-base font-medium text-foreground">
                        {isReady ? t('toolsWall.noResults') : 'No tools found'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isReady ? t('toolsWall.noResultsHint') : 'Try a different keyword or category'}
                    </p>
                </div>
            ) : grouped ? (
                <div className="space-y-10">
                    {grouped.map(({ category, tools: catTools }) => {
                        const CatIcon = getIcon(category.icon)
                        const [featured, ...rest] = catTools

                        return (
                            <motion.section
                                key={category.key}
                                variants={shouldReduceMotion ? containerReduced : sectionVariants}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: '-50px' }}
                            >
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div
                                        className="flex h-7 w-7 items-center justify-center rounded-lg"
                                        style={{ backgroundColor: `${category.color}15`, color: category.color }}
                                    >
                                        <CatIcon className="h-3.5 w-3.5" strokeWidth={2} />
                                    </div>
                                    <h2 className="text-sm font-semibold text-foreground">
                                        {category.label[lang] || category.label.en}
                                    </h2>
                                    <span className="text-xs text-muted-foreground/60 tabular-nums">
                                        {catTools.length}
                                    </span>
                                    <div className="flex-1 h-px bg-border" />
                                </div>
                                <motion.div
                                    variants={shouldReduceMotion ? containerReduced : container}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <AnimatePresence mode="popLayout">
                                        <motion.div
                                            key={featured.id}
                                            layout
                                            variants={shouldReduceMotion ? itemReduced : item}
                                            className="md:col-span-2"
                                        >
                                            <ToolCard tool={featured} featured />
                                        </motion.div>
                                        {rest.map((tool) => (
                                            <motion.div
                                                key={tool.id}
                                                layout
                                                variants={shouldReduceMotion ? itemReduced : item}
                                            >
                                                <ToolCard tool={tool} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.section>
                        )
                    })}
                </div>
            ) : (
                <motion.div
                    variants={shouldReduceMotion ? containerReduced : container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((tool, index) => (
                            <motion.div
                                key={tool.id}
                                layout
                                variants={shouldReduceMotion ? itemReduced : item}
                                className={index === 0 ? 'md:col-span-2' : ''}
                            >
                                <ToolCard tool={tool} featured={index === 0} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}
