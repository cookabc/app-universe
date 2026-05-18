'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PackageSearch } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SearchBar } from '@/components/SearchBar'
import { ToolCard } from '@/components/ToolCard'
import type { Tool } from '@/data/tools'
import tools, { TOOL_CATEGORIES } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const containerReduced = { hidden: { opacity: 1 }, show: { opacity: 1 } }

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const itemReduced = { hidden: { opacity: 1 }, show: { opacity: 1 } }

export function ToolGrid() {
    const { t, isReady } = useI18nReady()
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

    return (
        <div className="space-y-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter tools={tools} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <PackageSearch className="h-10 w-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">
                        {isReady ? t('toolsWall.noResults') : 'No tools found'}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        {isReady ? t('toolsWall.noResultsHint') : 'Try a different keyword or category'}
                    </p>
                </div>
            ) : (
                <motion.div
                    variants={shouldReduceMotion ? containerReduced : container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                >
                    {filtered.map((tool) => (
                        <motion.div key={tool.id} variants={shouldReduceMotion ? itemReduced : item}>
                            <ToolCard tool={tool} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}
