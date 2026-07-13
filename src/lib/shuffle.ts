/**
 * Fisher–Yates shuffle. Returns a new array; the input is not mutated.
 *
 * Uses `Math.random`, so it is non-deterministic and must only run on the
 * client (call from an effect) to avoid SSR/hydration mismatches.
 */
export function shuffle<T>(array: readonly T[]): T[] {
    const result = array.slice()
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}
