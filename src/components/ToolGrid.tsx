'use client'

import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { TagFilter } from '@/components/TagFilter'
import { ToolCard } from '@/components/ToolCard'
import type { Tool } from '@/data/tools'
import tools from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.12 } },
}
const itemReduced = { hidden: { opacity: 1 }, show: { opacity: 1 }, exit: { opacity: 0 } }

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

    return (
        <div className="space-y-5">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <TagFilter tools={tools} activeTag={activeTag} onTagChange={setActiveTag} />

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MagnifyingGlassIcon className="h-12 w-12 text-muted-foreground/40 mb-4" weight="duotone" />
                    <p className="text-base font-medium text-foreground">
                        {isReady ? t('toolsWall.noResults') : 'No tools found'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isReady ? t('toolsWall.noResultsHint') : 'Try a different keyword or tag'}
                    </p>
                </div>
            ) : (
                <div className="columns-1 md:columns-3 gap-4">
                    <AnimatePresence>
                        {filtered.map((tool, i) => (
                            <motion.div
                                key={tool.id}
                                className="break-inside-avoid mb-4"
                                initial={shouldReduceMotion ? undefined : 'hidden'}
                                animate={shouldReduceMotion ? undefined : 'show'}
                                exit={shouldReduceMotion ? undefined : 'exit'}
                                variants={shouldReduceMotion ? itemReduced : item}
                            >
                                <ToolCard tool={tool} index={i} onTagClick={setActiveTag} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
