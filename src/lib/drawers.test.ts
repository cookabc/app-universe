import assert from 'node:assert/strict'
import { test } from 'node:test'
import TOOLS from '../data/tools.ts'
import { WORKFLOWS } from '../data/workflow.ts'
import { CABINET_ROWS, DRAWERS, drawerOf, drawersInStage, habitOf, labelOf } from './drawers.ts'

test('every tool has exactly one drawer, coded by column and row', () => {
    assert.equal(DRAWERS.length, TOOLS.length)
    assert.equal(new Set(DRAWERS.map((drawer) => drawer.code)).size, TOOLS.length)
    assert.equal(drawerOf(WORKFLOWS[0].toolIds[0])?.code, 'A1')
    assert.equal(drawerOf(WORKFLOWS[2].toolIds[3])?.code, 'C4')
    assert.equal(drawerOf('not-a-tool'), undefined)
})

test('the cabinet is as tall as its longest route', () => {
    assert.equal(CABINET_ROWS, Math.max(...WORKFLOWS.map((flow) => flow.toolIds.length)))
    WORKFLOWS.forEach((flow, stage) => {
        assert.deepEqual(
            drawersInStage(stage).map((drawer) => drawer.tool.id),
            flow.toolIds,
        )
    })
})

test('every note lays out as a three-row label in both languages', () => {
    for (const tool of TOOLS) {
        for (const lang of ['en', 'zh'] as const) {
            const label = labelOf(tool, lang)
            assert.ok(label, `${tool.id} ${lang} did not lay out`)
            assert.ok(label.when && label.replaces && label.caveat)
            assert.doesNotMatch(label.replaces, /^(Replaces|能替代)/)
            assert.doesNotMatch(label.caveat, /^(Caveat:|注意)/)
        }
    }
})

test('habits read as short running phrases', () => {
    assert.equal(habitOf(drawerOf('timing')!.tool, 'en'), 'guessing cubic-bezier values')
    assert.equal(habitOf(drawerOf('timing')!.tool, 'zh'), '瞎猜 cubic-bezier')
    for (const tool of TOOLS) {
        const en = habitOf(tool, 'en')
        assert.ok(en.length > 4 && !en.endsWith('.'), `${tool.id}: "${en}"`)
        assert.ok(!habitOf(tool, 'zh').startsWith('能替代'))
    }
})
