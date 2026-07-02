'use client'

import { useMemo } from 'react'
import type { Tool } from '@/data/tools'
import { TOOL_CATEGORIES, type ToolCategory } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { getIcon } from '@/lib/icon-map'

interface CategoryFilterProps {
    tools: Tool[]
    activeCategory: string
    onCategoryChange: (key: string) => void
}

export function CategoryFilter({ tools, activeCategory, onCategoryChange }: CategoryFilterProps) {
    const { i18n } = useI18nReady()
    const lang = i18n.language as 'en' | 'zh'

    const counts = useMemo(() => {
        const map: Record<string, number> = { all: tools.length }
        for (const tool of tools) {
            map[tool.category] = (map[tool.category] || 0) + 1
        }
        return map
    }, [tools])

    return (
        <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4 md:mx-0 md:px-0">
            {TOOL_CATEGORIES.map((cat: ToolCategory) => {
                const Icon = getIcon(cat.icon)
                const count = counts[cat.key]
                if (cat.key !== 'all' && !count) return null

                const isActive = activeCategory === cat.key

                return (
                    <button
                        key={cat.key}
                        type="button"
                        onClick={() => onCategoryChange(cat.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all duration-200 surface-active ${
                            isActive
                                ? 'bg-foreground text-background border-foreground shadow-sm'
                                : 'bg-card text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground'
                        }`}
                        aria-pressed={isActive}
                    >
                        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                        <span>
                            {cat.key === 'all' ? (lang === 'zh' ? '全部' : 'All') : cat.label[lang] || cat.label.en}
                        </span>
                        {count !== undefined && (
                            <span
                                className={`text-[10px] tabular-nums ${isActive ? 'opacity-70' : 'text-muted-foreground/70'}`}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
