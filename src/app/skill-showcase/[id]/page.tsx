'use client'

import dynamic from 'next/dynamic'
import { use } from 'react'

const SkillDetail = dynamic(() => import('../components/SkillDetailPage'), {
    ssr: false,
    loading: () => (
        <div className="flex min-h-[60vh] items-center justify-center">
            <span className="text-sm text-muted-foreground">Loading skill...</span>
        </div>
    ),
})

export default function SkillDetailRoute({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    return <SkillDetail id={id} />
}
