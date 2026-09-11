import assert from 'node:assert/strict'
import { test } from 'node:test'
import { wrapText } from './note-card-image.ts'

/** Fixed-width measurer: every character counts as one unit. */
const measure = (s: string) => [...s].length

test('wrapText keeps short text on one line', () => {
    assert.deepEqual(wrapText('hello world', 20, measure), ['hello world'])
})

test('wrapText breaks on word boundaries', () => {
    assert.deepEqual(wrapText('aaa bbb ccc', 7, measure), ['aaa bbb', 'ccc'])
})

test('wrapText breaks overlong unspaced text by grapheme (CJK)', () => {
    const lines = wrapText('先选定一套系统并坚持用完', 5, measure)
    assert.deepEqual(lines, ['先选定一套', '系统并坚持', '用完'])
    for (const line of lines) assert.ok(measure(line) <= 5)
})

test('wrapText splits mixed Latin and CJK without losing characters', () => {
    const text = 'replaces Figma 等通用套件'
    const lines = wrapText(text, 10, measure)
    assert.equal(lines.join('').replace(/ /g, ''), text.replace(/ /g, ''))
    for (const line of lines) assert.ok(measure(line) <= 10)
})

test('wrapText preserves explicit newlines', () => {
    assert.deepEqual(wrapText('ab\ncd', 10, measure), ['ab', 'cd'])
})

test('wrapText breaks long URLs by grapheme', () => {
    const url = 'https://example.com/very/long/path'
    const lines = wrapText(url, 12, measure)
    assert.ok(lines.length > 1)
    assert.equal(lines.join(''), url)
})
