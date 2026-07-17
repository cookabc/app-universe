'use client'

import { useMemo } from 'react'
import { normalizeLanguage } from '@/components/I18nProvider'
import type { Tool } from '@/data/tools'
import { formatTag } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

interface TagFilterProps {
    tools: Tool[]
    activeTag: string
    onTagChange: (tag: string) => void
}

export function TagFilter({ tools, activeTag, onTagChange }: TagFilterProps) {
    const { t, i18n, isReady } = useI18nReady()
    const lang = normalizeLanguage(i18n.language)

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

    const allLabel = isReady ? t('toolsWall.allTags') : lang === 'zh' ? '全部' : 'All'
    const groupLabel = isReady ? t('toolsWall.tagFilterLabel') : 'Filter by tag'

    const labelFor = (tag: string) => {
        if (isReady) {
            const key = `tags.${tag}`
            const translated = t(key)
            if (translated !== key) return translated
        }
        return formatTag(tag)
    }

    return (
        <div className="flex gap-1.5 flex-wrap py-1" role="group" aria-label={groupLabel}>
            <button
                type="button"
                onClick={() => onTagChange('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 radius-inner text-xs font-medium whitespace-nowrap border transition-all duration-200 surface-active ${
                    activeTag === 'all'
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
                }`}
                aria-pressed={activeTag === 'all'}
            >
                <span>{allLabel}</span>
                <span
                    className={`text-[10px] tabular-nums ${activeTag === 'all' ? 'opacity-70' : 'text-muted-foreground/70'}`}
                >
                    {tools.length}
                </span>
            </button>
            {tags.map(({ tag, count }) => {
                const isActive = activeTag === tag
                return (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => onTagChange(tag)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 radius-inner text-xs font-medium whitespace-nowrap border transition-all duration-200 surface-active ${
                            isActive
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
                        }`}
                        aria-pressed={isActive}
                    >
                        <span>{labelFor(tag)}</span>
                        <span
                            className={`text-[10px] tabular-nums ${isActive ? 'opacity-70' : 'text-muted-foreground/70'}`}
                        >
                            {count}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
