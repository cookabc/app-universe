import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { ICON_MAP } from '../lib/icon-map.ts'
import tools, { formatTag, getAllTags, getRelatedTools, getToolById, getToolPath } from './tools.ts'

test('formatTag title-cases kebab-case tag names and keeps acronyms', () => {
    assert.equal(formatTag('ai-design'), 'AI Design')
    assert.equal(formatTag('color'), 'Color')
    assert.equal(formatTag('design-system'), 'Design System')
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

test('every tool has complete bilingual fields, a valid icon, and a preview', () => {
    const ids = new Set<string>()
    const urls = new Set<string>()
    let featuredCount = 0
    let noteCount = 0

    for (const tool of tools) {
        assert.ok(tool.id.length > 0, 'tool id is required')
        assert.ok(!ids.has(tool.id), `duplicate tool id: ${tool.id}`)
        ids.add(tool.id)

        assert.ok(tool.tags.length > 0, `tool "${tool.id}" has no tags`)
        assert.ok(tool.icon in ICON_MAP, `tool "${tool.id}" has unknown icon ${tool.icon}`)
        assert.match(tool.url, /^https?:\/\//, `tool "${tool.id}" has an invalid url`)
        assert.ok(!urls.has(tool.url), `duplicate tool url: ${tool.url}`)
        urls.add(tool.url)

        assert.ok(tool.name.en.trim(), `tool "${tool.id}" missing en name`)
        assert.ok(tool.name.zh.trim(), `tool "${tool.id}" missing zh name`)
        assert.ok(tool.description.en.trim(), `tool "${tool.id}" missing en description`)
        assert.ok(tool.description.zh.trim(), `tool "${tool.id}" missing zh description`)
        assert.match(tool.color, /^#[0-9a-fA-F]{3,8}$/, `tool "${tool.id}" has invalid color`)
        assert.ok(existsSync(`public/previews/${tool.id}.png`), `missing preview for tool "${tool.id}"`)

        if (tool.featured) featuredCount += 1
        if (tool.note) {
            noteCount += 1
            assert.ok(tool.note.en.trim(), `tool "${tool.id}" note missing en`)
            assert.ok(tool.note.zh.trim(), `tool "${tool.id}" note missing zh`)
        }
    }

    assert.ok(noteCount === tools.length, 'every tool should have a curator note')
    assert.ok(featuredCount >= 3, 'expected at least a few featured tools')
})

test('getToolById and related tools helpers', () => {
    const first = tools[0]
    assert.equal(getToolById(first.id), first)
    assert.equal(getToolById('does-not-exist'), undefined)
    assert.equal(getToolPath(first.id), `/t/${first.id}`)

    const related = getRelatedTools(first, 3)
    assert.ok(related.length <= 3)
    assert.ok(!related.some((tool) => tool.id === first.id))
    for (const item of related) {
        assert.ok(item.tags.some((tag) => first.tags.includes(tag)))
    }
})
