'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { SkillData } from '../../data/skills'
import SkillCard from './SkillCard'

interface Props {
    skills: SkillData[]
}

export default function SkillGrid({ skills }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting) setVisible(true)
    }, [])

    useEffect(() => {
        const el = ref.current
        if (!el || !skills.length) return
        const obs = new IntersectionObserver(onIntersect, { threshold: 0.08 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [skills.length, onIntersect])

    if (!skills.length)
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <p className="text-2xl font-bold tracking-tight text-foreground">No Skills Found</p>
                <p className="text-sm text-muted-foreground">Try a broader search or clear the active category.</p>
            </div>
        )

    return (
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((s, i) => (
                <SkillCard key={s.id} skill={s} index={i} visible={visible} />
            ))}
        </div>
    )
}
