'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Badge } from '@/components/ui/badge'
import type { SkillData } from '../../data/skills'
import { buildSkillShowcaseModel } from '../../utils/skillShowcase'

interface Props {
    skill: SkillData
    index: number
    visible?: boolean
}

export default function SkillCard({ skill, index, visible = false }: Props) {
    const cat = skill.category
    const delay = Math.min(index * 60, 420)
    const model = buildSkillShowcaseModel(skill)

    return (
        <Link href={`/skill-showcase/${skill.id}`} className="block text-inherit no-underline">
            <article
                className="rounded-[var(--radius)] border-2 border-slate-800 bg-card p-6 shadow-[var(--box-shadow)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1"
                style={
                    {
                        '--card-color': `var(--cat-${cat.key}, ${cat.color})`,
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(18px)',
                        transitionDelay: `${delay}ms`,
                    } as CSSProperties
                }
            >
                <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge
                        variant="outline"
                        className="text-xs"
                        style={
                            {
                                color: `var(--cat-${cat.key})`,
                                borderColor: `var(--cat-${cat.key})`,
                            } as CSSProperties
                        }
                    >
                        <span
                            className="mr-1 inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: `var(--cat-${cat.key})` }}
                            aria-hidden="true"
                        />
                        {cat.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground tabular-nums">
                        {skill.fileInfo.totalFiles} files
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground leading-tight mb-2">{skill.name}</h3>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {skill.description || 'No description available'}
                </p>

                <div className="mt-auto rounded-md border border-border bg-muted/50 p-3">
                    <span className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Trigger</span>
                    <code
                        className="block text-xs truncate"
                        style={{ color: `var(--cat-${cat.key})` } as CSSProperties}
                    >
                        {model.primaryTrigger}
                    </code>
                </div>
            </article>
        </Link>
    )
}
