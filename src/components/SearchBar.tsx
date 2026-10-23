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
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground"
                weight="bold"
                aria-hidden="true"
            />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={ariaLabel}
                className="h-14 w-full rounded-[var(--radius)] border border-foreground bg-card pl-12 pr-12 font-mono text-sm outline-none transition-[box-shadow,border-color] placeholder:text-muted-foreground focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_18%,transparent)]"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={clearLabel}
                >
                    <XIcon className="h-4 w-4" weight="bold" />
                </button>
            )}
        </form>
    )
}
