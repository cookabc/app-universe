'use client'

import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useI18nReady } from '@/hooks/useI18nReady'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    const { t, isReady } = useI18nReady()
    const placeholder = isReady ? t('toolsWall.searchPlaceholder') : 'Search tools by name, tag, or keyword...'
    const ariaLabel = isReady ? t('toolsWall.searchAriaLabel') : 'Search tools'
    const clearLabel = isReady ? t('toolsWall.clearSearch') : 'Clear search'

    return (
        <form role="search" className="relative w-full" onSubmit={(e) => e.preventDefault()}>
            <MagnifyingGlassIcon
                className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                weight="regular"
                aria-hidden="true"
            />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={ariaLabel}
                className="w-full bg-transparent border-0 border-b border-border pl-7 pr-8 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label={clearLabel}
                >
                    <XIcon className="h-4 w-4" />
                </button>
            )}
        </form>
    )
}
