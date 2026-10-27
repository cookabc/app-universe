/**
 * Ensure a Vary header lists Accept.
 *
 * The App Router sets Vary with `res.setHeader`, which replaces the value the
 * proxy appended. Call this on that write so HTML and markdown are not cached
 * as one variant.
 */
export function withAcceptVary(value: string | number | readonly string[]): string {
    const text = Array.isArray(value) ? value.join(', ') : String(value)
    const parts = text
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    if (parts.some((part) => part.toLowerCase() === 'accept')) return parts.join(', ')
    parts.push('Accept')
    return parts.join(', ')
}
