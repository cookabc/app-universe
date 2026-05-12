import type { DesignResource } from './resources.types'

export type { DesignResource }

let _cache: DesignResource[] | null = null
let _promise: Promise<DesignResource[]> | null = null
const resourcesDataUrl = '/skill-showcase/resources-data.json'

export async function loadResourcesData(): Promise<DesignResource[]> {
    if (_cache) return _cache
    if (_promise) return _promise

    _promise = fetch(resourcesDataUrl)
        .then((response) => {
            if (!response.ok) throw new Error('Failed to load resources data: ' + response.status)
            return response.json()
        })
        .then((data: DesignResource[]) => {
            if (!Array.isArray(data)) throw new Error('Resources data is not a valid array.')
            _cache = data
            return data
        })
        .catch((error) => {
            _promise = null
            throw error
        })

    return _promise
}

export async function getFeaturedResources(): Promise<DesignResource[]> {
    const resources = await loadResourcesData()
    return resources.filter((resource) => resource.featured)
}

export async function getResourcesForSkill(skillId: string): Promise<DesignResource[]> {
    const resources = await loadResourcesData()
    return resources.filter((resource) => resource.relatedSkillIds.includes(skillId))
}
