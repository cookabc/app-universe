import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getAllSkills, type SkillData } from '../../data/skills'

interface Props {
    currentId: string
}

export default function RelatedSkills({ currentId }: Props) {
    const [rel, setRel] = useState<SkillData[]>([])
    const [cl, setCl] = useState('')

    useEffect(() => {
        getAllSkills().then((all) => {
            const cur = all.find((s) => s.id === currentId)
            if (!cur) return
            setCl(cur.category.label)
            const f = all.filter((s) => s.id !== currentId && s.category.key === cur.category.key).slice(0, 4)
            setRel(f)
        })
    }, [currentId])

    if (!rel.length) return null

    return (
        <div className="rounded-[var(--radius)] border-2 border-slate-800 bg-card p-6 shadow-[var(--box-shadow)]">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-foreground">
                <span className="w-1 h-5 rounded bg-primary" />
                Related Skills ({cl})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {rel.map((s) => (
                    <Link
                        key={s.id}
                        href={`/skill-showcase/${s.id}`}
                        className="rounded-lg bg-muted border border-border p-4 flex flex-col justify-between min-h-[80px] hover:-translate-y-0.5 hover:border-foreground transition-all duration-200"
                    >
                        <div className="font-semibold text-foreground text-sm leading-tight">{s.name}</div>
                        <span className="text-xs text-muted-foreground mt-2">{s.category.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
