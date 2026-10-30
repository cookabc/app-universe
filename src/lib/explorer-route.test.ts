import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readExplorerRoute, writeExplorerRoute } from './explorer-route.ts'

test('sharing restores the current tool as well as the ordering seed', () => {
    const url = writeExplorerRoute('https://wayseeker.example/?lang=zh#notes', { seed: 'abc123', tool: 'motion' })
    assert.deepEqual(readExplorerRoute(url.search, ['motion', 'design']), { seed: 'abc123', tool: 'motion' })
    assert.equal(url.searchParams.get('lang'), 'zh')
    assert.equal(url.hash, '#notes')
})
test('unknown tools and invalid seeds cannot select an arbitrary scene', () => {
    assert.deepEqual(readExplorerRoute('?seed=%3Cscript%3E&tool=missing', ['motion']), { seed: null, tool: null })
    assert.deepEqual(readExplorerRoute('?seed=ABC123&tool=motion', ['motion']), { seed: 'abc123', tool: 'motion' })
    assert.equal(
        writeExplorerRoute('https://wayseeker.example/?seed=abc&tool=motion', { seed: null, tool: null }).search,
        '',
    )
})
