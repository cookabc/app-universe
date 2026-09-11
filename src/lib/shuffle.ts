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
 * mulberry32 — tiny deterministic PRNG so a shuffle can be reproduced from a
 * seed shared in the URL (?seed=...).
 */
function mulberry32(seed: number): () => number {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/** Deterministic Fisher–Yates driven by a numeric seed. */
export function seededShuffle<T>(array: readonly T[], seed: number): T[] {
    const rand = mulberry32(seed)
    const result = array.slice()
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}

const SEED_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'

/** Random seed encoded as a short lowercase base-36 string (e.g. "k4x9f2"). */
export function randomSeed(): string {
    return Math.floor(Math.random() * 36 ** 6)
        .toString(36)
        .padStart(6, '0')
}

/** Parse a URL seed string; returns null when the value is not a valid seed. */
export function parseSeed(value: string | null): number | null {
    if (!value || value.length > 12) return null
    const lowered = value.toLowerCase()
    if (!lowered.split('').every((ch) => SEED_ALPHABET.includes(ch))) return null
    const parsed = Number.parseInt(lowered, 36)
    return Number.isSafeInteger(parsed) ? parsed : null
}

/** Numeric seed → URL-safe string. */
export function encodeSeed(seed: number): string {
    return seed.toString(36)
}

/** URL seed string → numeric seed for seededShuffle (assumes parseSeed passed). */
export function seedToNumber(seed: string): number {
    return Number.parseInt(seed.toLowerCase(), 36)
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
