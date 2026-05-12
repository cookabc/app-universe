'use client'

import { useSkills } from '../../hooks/useSkills'

export default function HeroSection() {
    const { total, skills } = useSkills()
    const catCount = new Set(skills.map((s) => s.category.key)).size
    const installable = skills.filter((s) => s.installCommand).length

    return (
        <section className="max-w-7xl mx-auto px-4 pt-12 pb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Skill Showcase</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
                Explore and discover AI agent skills and capabilities. Browse by category, search by name, or dive into
                individual skill details.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
                <StatItem value={total} label="Skills" />
                <StatItem value={catCount} label="Categories" />
                <StatItem value={installable} label="Installable" />
            </div>
        </section>
    )
}

function StatItem({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex items-baseline gap-2 rounded-[var(--radius)] border border-border bg-card px-4 py-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
            <span className="text-sm text-muted-foreground">{label}</span>
        </div>
    )
}
