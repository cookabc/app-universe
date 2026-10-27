import assert from 'node:assert/strict'
import { test } from 'node:test'
import { withTagParam } from './discovery-url.ts'

test('withTagParam writes the tag and keeps the seed and hash', () => {
    assert.equal(
        withTagParam('http://localhost:3000/?seed=k4x9f2#tools', 'ai'),
        'http://localhost:3000/?seed=k4x9f2&tag=ai#tools',
    )
})

test('withTagParam removes tag when the filter is cleared', () => {
    assert.equal(
        withTagParam('http://localhost:3000/?tag=motion&seed=k4x9f2#tools', 'all'),
        'http://localhost:3000/?seed=k4x9f2#tools',
    )
    assert.equal(withTagParam('/?tag=ui#tools', ''), '/#tools')
})

test('withTagParam replaces an existing tag', () => {
    assert.equal(withTagParam('/?tag=ui', 'games'), '/?tag=games')
})
