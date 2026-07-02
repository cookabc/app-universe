'use client'

import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { useI18nReady } from '@/hooks/useI18nReady'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    const { t, isReady } = useI18nReady()

    return (
        <div className="relative w-full">
            <MagnifyingGlass
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70"
                weight="regular"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={
                    isReady ? t('toolsWall.searchPlaceholder') : 'Search tools by name, category, or keyword...'
                }
                className="w-full rounded-[var(--radius)] border border-border bg-card pl-10 pr-10 py-2.5 text-sm shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-border/80 focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors rounded-full p-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}
