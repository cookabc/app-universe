'use client'

import { MagnifyingGlass } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { TagFilter } from '@/components/TagFilter'
import { ToolCard } from '@/components/ToolCard'
import type { Tool } from '@/data/tools'
import tools from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

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

export function ToolGrid() {
    const { t, isReady } = useI18nReady()
    const shouldReduceMotion = useReducedMotion()

    const [searchQuery, setSearchQuery] = useState('')
    const [activeTag, setActiveTag] = useState('all')

    const filtered = useMemo(() => {
        let result: Tool[] = tools

        if (activeTag !== 'all') {
            result = result.filter((tool) => tool.tags.includes(activeTag))
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            result = result.filter((tool) => {
                const nameMatch = tool.name.en.toLowerCase().includes(q) || tool.name.zh.toLowerCase().includes(q)
                const descMatch =
                    tool.description.en.toLowerCase().includes(q) || tool.description.zh.toLowerCase().includes(q)
                const tagMatch = tool.tags.some((tag) => tag.includes(q))
                return nameMatch || descMatch || tagMatch
            })
        }

        return result
    }, [searchQuery, activeTag])

    const [featured, ...rest] = filtered

    return (
        <div className="space-y-5">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <TagFilter tools={tools} activeTag={activeTag} onTagChange={setActiveTag} />

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MagnifyingGlass className="h-12 w-12 text-muted-foreground/40 mb-4" weight="duotone" />
                    <p className="text-base font-medium text-foreground">
                        {isReady ? t('toolsWall.noResults') : 'No tools found'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isReady ? t('toolsWall.noResultsHint') : 'Try a different keyword or tag'}
                    </p>
                </div>
            ) : (
                <motion.div
                    variants={shouldReduceMotion ? containerReduced : container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {featured && (
                            <motion.div
                                key={featured.id}
                                layout
                                variants={shouldReduceMotion ? itemReduced : item}
                                className="md:col-span-2"
                            >
                                <ToolCard tool={featured} featured />
                            </motion.div>
                        )}
                        {rest.map((tool) => (
                            <motion.div key={tool.id} layout variants={shouldReduceMotion ? itemReduced : item}>
                                <ToolCard tool={tool} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}
