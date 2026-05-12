'use client'

import type { CSSProperties } from 'react'
import { Badge } from '@/components/ui/badge'
import { CATEGORIES } from '../../data/categories'

interface Props {
    active: string
    onChange: (v: string) => void
    availableKeys?: string[]
}

export default function CategoryFilter({ active, onChange, availableKeys }: Props) {
    const cats = availableKeys ? CATEGORIES.filter((c) => availableKeys.includes(c.key)) : CATEGORIES

    return (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
            <Badge
                variant={active === 'all' ? 'default' : 'outline'}
                className="cursor-pointer select-none"
                role="tab"
                aria-selected={active === 'all'}
                onClick={() => onChange('all')}
            >
                All
            </Badge>
            {cats.map((c) => (
                <Badge
                    key={c.key}
                    variant={active === c.key ? 'default' : 'outline'}
                    className="cursor-pointer select-none"
                    role="tab"
                    aria-selected={active === c.key}
                    onClick={() => onChange(c.key)}
                    style={
                        active === c.key
                            ? ({
                                  '--tw-ring-color': `var(--cat-${c.key})`,
                                  backgroundColor: `var(--cat-${c.key})`,
                                  borderColor: `var(--cat-${c.key})`,
                              } as CSSProperties)
                            : ({
                                  '--tw-ring-color': `var(--cat-${c.key})`,
                              } as CSSProperties)
                    }
                >
                    <span
                        className="mr-1 inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: `var(--cat-${c.key})` }}
                        aria-hidden="true"
                    />
                    {c.label}
                </Badge>
            ))}
        </div>
    )
}
