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

/**
 * Shuffles an array and guarantees a visibly different order when at least
 * two distinct entries are present.
 */
export function shuffleDifferent<T>(array: readonly T[], previous: readonly T[]): T[] {
    const result = shuffle(array)
    const hasSameOrder =
        result.length > 1 &&
        result.length === previous.length &&
        result.every((item, index) => item === previous[index])

    if (hasSameOrder) {
        const first = result.shift()
        if (first !== undefined) {
            result.push(first)
        }
    }

    return result
}
