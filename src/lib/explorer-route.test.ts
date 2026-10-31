import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readExplorerRoute, writeExplorerRoute } from './explorer-route.ts'

test('sharing restores the current tool as well as the ordering seed', () => {
    const url = writeExplorerRoute('https://wayseeker.example/?lang=zh#notes', {
        seed: 'abc123',
        tool: 'motion',
        plan: null,
        picks: null,
    })
    assert.deepEqual(readExplorerRoute(url.search, ['motion', 'design']), {
        seed: 'abc123',
        tool: 'motion',
        plan: null,
        picks: null,
    })
    assert.equal(url.searchParams.get('lang'), 'zh')
    assert.equal(url.hash, '#notes')
})
test('unknown tools and invalid seeds cannot select an arbitrary scene', () => {
    assert.deepEqual(readExplorerRoute('?seed=%3Cscript%3E&tool=missing', ['motion']), {
        seed: null,
        tool: null,
        plan: null,
        picks: null,
    })
    assert.deepEqual(readExplorerRoute('?seed=ABC123&tool=motion', ['motion']), {
        seed: 'abc123',
        tool: 'motion',
        plan: null,
        picks: null,
    })
    assert.equal(
        writeExplorerRoute('https://wayseeker.example/?seed=abc&tool=motion', {
            seed: null,
            tool: null,
            plan: null,
            picks: null,
        }).search,
        '',
    )
})

test('a plan seed and its picks ride the same link and survive round-trips', () => {
    const url = writeExplorerRoute('https://wayseeker.example/', {
        seed: null,
        tool: null,
        plan: 'k4x9f2',
        picks: 'kenney..paper-shaders.',
    })
    assert.deepEqual(readExplorerRoute(url.search, ['kenney', 'paper-shaders']), {
        seed: null,
        tool: null,
        plan: 'k4x9f2',
        picks: 'kenney..paper-shaders.',
    })
})

test('malformed plan state is dropped, not trusted', () => {
    // Bad seed alphabet, over-long picks, too many segments, and stray capitals.
    assert.equal(readExplorerRoute('?plan=%3Cscript%3E', []).plan, null)
    assert.equal(readExplorerRoute('?plan=abc123&p=x'.replace('x', 'a'.repeat(200)), []).picks, null)
    assert.equal(readExplorerRoute('?plan=abc123&p=a.b.c.d.e.f.g', []).picks, null)
    assert.equal(readExplorerRoute('?plan=abc123&p=Kenney', []).picks, null)
    assert.equal(readExplorerRoute('?p=kenney', []).plan, null, 'picks without a plan seed are meaningless')
})
