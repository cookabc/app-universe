'use client'

import { Input } from '@/components/ui/input'

interface Props {
    value: string
    onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
    return (
        <div className="relative w-full max-w-md">
            <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
            <Input
                type="search"
                placeholder="Search by name, category, or workflow..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 pl-10 pr-10"
            />
            {value && (
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                >
                    &times;
                </button>
            )}
        </div>
    )
}
