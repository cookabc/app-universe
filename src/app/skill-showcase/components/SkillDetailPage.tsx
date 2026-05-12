'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { SkillData } from '../data/skills'
import { getSkillById } from '../data/skills'
import LiveDemoSection from './Demos/LiveDemoSection'
import UnifiedLayout from './SkillDetail/layouts/UnifiedLayout'
import RelatedResources from './SkillDetail/RelatedResources'
import RelatedSkills from './SkillDetail/RelatedSkills'

export default function SkillDetailPage({ id }: { id: string }) {
    const [skill, setSkill] = useState<SkillData | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) {
            setLoading(false)
            return
        }
        getSkillById(decodeURIComponent(id))
            .then((s) => {
                setSkill(s)
                setError(null)
                setLoading(false)
            })
            .catch((e: unknown) => {
                setError(e instanceof Error ? e.message : 'Failed to load skill.')
                setLoading(false)
            })
    }, [id])

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
                <span className="text-sm text-muted-foreground">Loading skill...</span>
            </div>
        )
    }

    if (!skill) {
        return (
            <section className="mx-auto max-w-xl px-4 py-20 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-destructive mb-2">
                    {error ? 'Data unavailable' : 'Not found'}
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {error ? 'Skill data could not be loaded.' : 'Skill not found'}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">{error || `No skill found with ID: "${id}".`}</p>
                <Link
                    href="/skill-showcase"
                    className="inline-block mt-5 text-sm font-medium text-primary hover:underline"
                >
                    Back to gallery
                </Link>
            </section>
        )
    }

    return (
        <div className="w-full">
            <UnifiedLayout skill={skill} />

            {skill.installCommand && (
                <section className="max-w-5xl mx-auto mt-7">
                    <LiveDemoSection skill={skill} />
                </section>
            )}

            <section className="max-w-5xl mx-auto mt-7">
                <RelatedResources skillId={skill.id} />
            </section>

            <section className="max-w-5xl mx-auto mt-7">
                <RelatedSkills currentId={skill.id} />
            </section>
        </div>
    )
}
