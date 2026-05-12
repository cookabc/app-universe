'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useSearch, useSkills } from '../hooks/useSkills'
import CategoryFilter from './Home/CategoryFilter'
import FeaturedResources from './Home/FeaturedResources'
import HeroSection from './Home/HeroSection'
import SearchBar from './Home/SearchBar'
import SkillGrid from './Home/SkillGrid'

export default function HomePage() {
    const { skills, loading, error } = useSkills()
    const searchParams = useSearchParams()
    const router = useRouter()
    const q = searchParams.get('q') || ''
    const cat = searchParams.get('cat') || 'all'

    const updateQueryState = (next: { q?: string; cat?: string }) => {
        const params = new URLSearchParams(searchParams.toString())
        if (next.q !== undefined) {
            if (next.q.trim()) params.set('q', next.q)
            else params.delete('q')
        }
        if (next.cat !== undefined) {
            if (next.cat && next.cat !== 'all') params.set('cat', next.cat)
            else params.delete('cat')
        }
        router.replace(`/skill-showcase?${params.toString()}`)
    }

    const filtered = useSearch(skills, q, cat)
    const activeCategoryKeys = [...new Set(skills.map((s) => s.category.key))]

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
                <span className="text-muted-foreground text-sm">Loading skills...</span>
            </div>
        )
    }

    if (error) {
        return (
            <section className="mx-auto max-w-xl px-4 py-20 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-destructive mb-2">Data unavailable</p>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Skill data could not be loaded.</h1>
                <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </section>
        )
    }

    return (
        <>
            <HeroSection />
            <FeaturedResources />
            <section id="skills" className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Available Skills</h2>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
                        {filtered.length} results
                    </span>
                </div>

                <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-start sm:justify-between">
                    <SearchBar value={q} onChange={(value) => updateQueryState({ q: value })} />
                    <CategoryFilter
                        active={cat}
                        onChange={(value) => updateQueryState({ cat: value })}
                        availableKeys={activeCategoryKeys}
                    />
                </div>

                <SkillGrid skills={filtered} />
            </section>
        </>
    )
}
