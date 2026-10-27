import assert from 'node:assert/strict'
import { test } from 'node:test'
import { withAcceptVary } from './vary.ts'

test('withAcceptVary appends Accept to the App Router vary list', () => {
    const next = withAcceptVary('rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch')
    assert.equal(next, 'rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept')
})

test('withAcceptVary does not duplicate an existing Accept token', () => {
    assert.equal(withAcceptVary('Accept'), 'Accept')
    assert.equal(withAcceptVary('accept, Accept-Encoding'), 'accept, Accept-Encoding')
})

test('withAcceptVary accepts an array of vary tokens', () => {
    assert.equal(withAcceptVary(['rsc', 'next-router-state-tree']), 'rsc, next-router-state-tree, Accept')
})
