import { formatTag, type Tool } from '../data/tools.ts'

/** Normalize free-text search so hyphens/spaces do not block matches. */
export function normalizeQuery(value: string): string {
    return value.toLowerCase().replace(/[-\s_./]+/g, '')
}

/** Hostname without www for domain matching in search. */
export function getDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

/** True when `value` contains the query, ignoring separator differences. */
function matchesQuery(value: string, query: string, normalizedQuery: string): boolean {
    const lower = value.toLowerCase()
    if (lower.includes(query)) return true
    return normalizedQuery.length > 0 && normalizeQuery(lower).includes(normalizedQuery)
}

/**
 * Filter the curated tool list by active tag and free-text query.
 * Matches name, description, curator note, tags, and domain (real shipped path).
 * Names like "NameThatUI" match "name that ui"; a query of only separators matches nothing.
 */
export function filterTools(list: Tool[], activeTag: string, searchQuery: string): Tool[] {
    let result = list

    if (activeTag !== 'all') {
        result = result.filter((tool) => tool.tags.includes(activeTag))
    }

    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const qNorm = normalizeQuery(q)
        // ".", "-", "..." and the like normalize to empty. `includes('')` is true
        // for every string, which previously returned the whole catalog.
        if (!qNorm) return []
        result = result.filter((tool) => {
            const nameMatch = matchesQuery(tool.name.en, q, qNorm) || matchesQuery(tool.name.zh, q, qNorm)
            const descMatch = matchesQuery(tool.description.en, q, qNorm) || matchesQuery(tool.description.zh, q, qNorm)
            const noteMatch =
                (tool.note ? matchesQuery(tool.note.en, q, qNorm) : false) ||
                (tool.note ? matchesQuery(tool.note.zh, q, qNorm) : false)
            const tagMatch = tool.tags.some(
                (tag) => matchesQuery(tag, q, qNorm) || matchesQuery(formatTag(tag), q, qNorm),
            )
            const domainMatch = matchesQuery(getDomain(tool.url), q, qNorm)
            return nameMatch || descMatch || noteMatch || tagMatch || domainMatch
        })
    }

    return result
}
