import assert from 'node:assert/strict'
import { test } from 'node:test'
import { shuffle, shuffleDifferent } from './shuffle.ts'

test('shuffle returns a new array (does not mutate the input)', () => {
    const input = [1, 2, 3, 4, 5]
    const snapshot = input.slice()
    const result = shuffle(input)
    assert.notEqual(result, input, 'should be a new array reference')
    assert.deepEqual(input, snapshot, 'input must not be mutated')
})

test('shuffle preserves the same multiset of elements', () => {
    const input = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const result = shuffle(input)
    assert.deepEqual([...result].sort(), [...input].sort())
    assert.equal(result.length, input.length)
})

test('shuffle handles empty and single-element arrays', () => {
    assert.deepEqual(shuffle([]), [])
    assert.deepEqual(shuffle([42]), [42])
})

test('shuffleDifferent changes an unchanged shuffle result', () => {
    const originalRandom = Math.random
    Math.random = () => 0.999

    try {
        assert.deepEqual(shuffleDifferent(['a', 'b', 'c'], ['a', 'b', 'c']), ['b', 'c', 'a'])
    } finally {
        Math.random = originalRandom
    }
})
