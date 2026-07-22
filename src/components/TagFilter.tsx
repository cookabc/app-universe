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

    const itemClass = (isActive: boolean) =>
        `index-label whitespace-nowrap pb-1 border-b transition-colors shrink-0 ${
            isActive
                ? 'text-foreground border-foreground'
                : 'text-muted-foreground border-transparent hover:text-foreground'
        }`

    return (
        <div
            className="flex gap-x-5 gap-y-2 py-1 overflow-x-auto max-sm:flex-nowrap sm:flex-wrap scrollbar-thin"
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
                    {labelFor(tag)} {count}
                </button>
            ))}
        </div>
    )
}
