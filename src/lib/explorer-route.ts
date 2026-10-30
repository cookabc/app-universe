import { parseSeed } from './shuffle.ts'

export interface ExplorerRoute {
    seed: string | null
    tool: string | null
}

/** Share only known tool IDs; keep unrelated query parameters and anchors. */
export function readExplorerRoute(search: string, knownIds: readonly string[]): ExplorerRoute {
    const params = new URLSearchParams(search)
    const value = params.get('seed')
    const tool = params.get('tool')
    return {
        seed: value && parseSeed(value) !== null ? value.toLowerCase() : null,
        tool: tool && knownIds.includes(tool) ? tool : null,
    }
}

export function writeExplorerRoute(href: string, route: ExplorerRoute): URL {
    const url = new URL(href)
    for (const key of ['seed', 'tool'] as const) {
        const value = route[key]
        if (value) url.searchParams.set(key, value)
        else url.searchParams.delete(key)
    }
    return url
}
