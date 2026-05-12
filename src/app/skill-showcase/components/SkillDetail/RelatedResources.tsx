import { useEffect, useState } from 'react'
import { type DesignResource, getResourcesForSkill } from '../../data/resources'
import ResourceCards from '../Resources/ResourceCards'

interface Props {
    skillId: string
}

export default function RelatedResources({ skillId }: Props) {
    const [resources, setResources] = useState<DesignResource[]>([])

    useEffect(() => {
        getResourcesForSkill(skillId)
            .then(setResources)
            .catch(() => setResources([]))
    }, [skillId])

    if (!resources.length) return null

    return (
        <div className="rounded-[var(--radius)] border-2 border-slate-800 bg-card p-6 shadow-[var(--box-shadow)]">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-foreground">
                <span className="w-1 h-5 rounded bg-primary" />
                Related Design Resources
            </h3>
            <ResourceCards resources={resources} variant="compact" />
        </div>
    )
}
