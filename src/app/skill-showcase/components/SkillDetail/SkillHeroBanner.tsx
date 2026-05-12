'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SkillData } from '../../data/skills'

interface Props {
    skill: SkillData
}

export default function SkillHeroBanner({ skill }: Props) {
    const [copied, setCopied] = useState(false)
    const cat = skill.category

    const handleCopy = async () => {
        if (skill.installCommand) {
            await navigator.clipboard.writeText(skill.installCommand)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="pb-8 mb-10 border-b border-border">
            <div className="flex items-center gap-3 flex-wrap mb-5">
                <Badge className="uppercase text-[11px] font-semibold" style={{ color: `var(--cat-${cat.key})` }}>
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: `var(--cat-${cat.key})` }} />
                    {cat.label}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-semibold font-mono uppercase">
                    {skill.stats.complexityLabel}
                </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">{skill.name}</h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-7">
                {skill.description || 'No description available.'}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
                {[
                    [String(skill.stats.lineCount), 'Lines'],
                    [String(skill.fileInfo.totalFiles), 'Files'],
                    [skill.stats.readTime, 'Read'],
                ].map(([value, label], i) => (
                    <div
                        key={i}
                        className="inline-flex items-baseline gap-1.5 px-3.5 py-2 rounded-full bg-muted border border-border"
                    >
                        <span className="text-[15px] font-semibold text-foreground tabular-nums">{value}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">{label}</span>
                    </div>
                ))}

                {skill.installCommand && (
                    <Button variant="outline" size="sm" onClick={handleCopy} className="ml-auto">
                        {copied ? 'Copied' : 'Copy Install Cmd'}
                    </Button>
                )}
            </div>
        </div>
    )
}
