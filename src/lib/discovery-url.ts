/**
 * Set or clear the `tag` query on a discovery URL.
 * `all` removes the param. Other params (seed) and the hash are kept.
 */
export function withTagParam(href: string, tag: string): string {
    const absolute = /^[a-z][a-z\d+.-]*:/i.test(href)
    const url = new URL(href, 'http://localhost')
    if (!tag || tag === 'all') url.searchParams.delete('tag')
    else url.searchParams.set('tag', tag)
    if (absolute) return url.toString()
    return `${url.pathname}${url.search}${url.hash}`
}
