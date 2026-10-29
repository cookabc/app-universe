import assert from 'node:assert/strict'
import { test } from 'node:test'
import TOOLS from './tools.ts'
import { toolWorkflowIndex, WORKFLOWS } from './workflow.ts'

test('every tool appears exactly once in the workflow map', () => {
    const ids = WORKFLOWS.flatMap((flow) => flow.toolIds)
    assert.equal(ids.length, TOOLS.length)
    assert.equal(new Set(ids).size, TOOLS.length)
    for (const tool of TOOLS) assert.ok(ids.includes(tool.id), `${tool.id} needs a workflow`)
    for (const id of ids)
        assert.ok(
            TOOLS.some((tool) => tool.id === id),
            `${id} must exist in the tool catalog`,
        )
})

test('each workflow has a complete bilingual task and several real tools', () => {
    for (const flow of WORKFLOWS) {
        assert.ok(flow.name.en && flow.name.zh)
        assert.ok(flow.question.en && flow.question.zh)
        assert.ok(flow.description.en && flow.description.zh)
        assert.ok(flow.toolIds.length > 0)
    }
})

test('tool lookup returns a real workflow and has a safe fallback', () => {
    assert.equal(toolWorkflowIndex('60fps'), 2)
    assert.equal(toolWorkflowIndex('not-a-tool'), 0)
})
