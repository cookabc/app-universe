'use client'

import { useMemo } from 'react'
import type { Tool } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import { useTagLabel } from '@/hooks/useTagLabel'

interface TagFilterProps {
    tools: Tool[]
    activeTag: string
    onTagChange: (tag: string) => void
}

export function TagFilter({ tools, activeTag, onTagChange }: TagFilterProps) {
    const { t, isReady } = useI18nReady()
    const tagLabel = useTagLabel()

    const tags = useMemo(() => {
        const counts = new Map<string, number>()
        for (const tool of tools) {
            for (const tag of tool.tags) {
                counts.set(tag, (counts.get(tag) || 0) + 1)
            }
        }
        return Array.from(counts.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([tag, count]) => ({ tag, count }))
    }, [tools])

    const allLabel = isReady ? t('toolsWall.allTags') : 'All'
    const groupLabel = isReady ? t('toolsWall.tagFilterLabel') : 'Filter by tag'

    const itemClass = (isActive: boolean) =>
        `index-label inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-[var(--radius)] border px-3 py-2 transition-all ${
            isActive
                ? 'index-label--accent-foreground border-foreground bg-accent '
                : 'border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground'
        }`

    return (
        <div
            className="flex gap-2 overflow-x-auto py-1 flex-nowrap scrollbar-thin"
            role="group"
            aria-label={groupLabel}
        >
            <button
                type="button"
                onClick={() => onTagChange('all')}
                className={itemClass(activeTag === 'all')}
                aria-pressed={activeTag === 'all'}
            >
                {allLabel} {tools.length}
            </button>
            {tags.map(({ tag, count }) => (
                <button
                    key={tag}
                    type="button"
                    onClick={() => onTagChange(tag)}
                    className={itemClass(activeTag === tag)}
                    aria-pressed={activeTag === tag}
                >
                    {tagLabel(tag)} {count}
                </button>
            ))}
        </div>
    )
}
