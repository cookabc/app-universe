import type { Metadata } from 'next'
export const metadata: Metadata = {
    title: 'Skill Showcase - Capability Atlas',
    description: 'Explore and discover AI agent skills and capabilities',
}
export default function SkillShowcaseLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
