import { Card, CardContent } from '@/components/ui/card'
import type { SkillData } from '../../data/skills'

interface Props {
    skill: SkillData
}

function getSummary(s: SkillData): string {
    const secs = s.stats.sectionCount
    const cbs = s.stats.codeBlockCount
    return `${secs} sections${cbs > 0 ? `, ${cbs} code example${cbs !== 1 ? 's' : ''}` : ''}${s.stats.complexityScore >= 5 ? ', moderate+ complexity' : ''}. Covers ${s.keyFeatures.slice(0, 3).join(', ') || 'general usage patterns'}.`
}

export default function AISummaryCard({ skill }: Props) {
    const summary = getSummary(skill)
    return (
        <Card className="max-w-3xl mx-auto mb-6">
            <CardContent className="p-4 flex gap-3 items-start">
                <span className="text-base shrink-0">🤖</span>
                <div>
                    <div className="text-[10px] text-primary font-semibold uppercase tracking-wider mb-1">
                        AI Summary
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{summary}</p>
                    <div className="mt-1.5 text-[11px] text-muted-foreground tabular-nums">
                        Auto-generated from SKILL.md · {skill.stats.readTime} read time
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
