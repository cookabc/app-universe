import assert from 'node:assert/strict'
import { test } from 'node:test'
import tools, { formatTag, getAllTags } from './tools.ts'

test('formatTag title-cases kebab-case tag names', () => {
    assert.equal(formatTag('ai-design'), 'Ai Design')
    assert.equal(formatTag('color'), 'Color')
    assert.equal(formatTag(''), '')
})

test('getAllTags returns the unique, sorted tag set', () => {
    const tags = getAllTags(tools)
    // Sorted and de-duplicated.
    const sorted = [...tags].sort()
    assert.deepEqual(tags, sorted)
    assert.equal(new Set(tags).size, tags.length)
    assert.ok(tags.length > 0)
})

test('every tool has at least one tag and a valid icon name', () => {
    for (const tool of tools) {
        assert.ok(tool.tags.length > 0, `tool "${tool.id}" has no tags`)
        assert.ok(tool.icon.length > 0, `tool "${tool.id}" has no icon`)
        assert.match(tool.url, /^https?:\/\//, `tool "${tool.id}" has an invalid url`)
    }
})
