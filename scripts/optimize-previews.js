#!/usr/bin/env node
/**
 * Recompress preview screenshots in public/previews in place.
 * Usage: node scripts/optimize-previews.js
 *
 * Screenshots arrive from download-previews as full-resolution RGB PNGs
 * (up to ~4.4 MB each). The site only ever shows them at card size, so this
 * caps the long edge at MAX_WIDTH and re-encodes with libimagequant palette
 * compression — visually lossless for UI screenshots at a fraction of the size.
 * Files already at or under MAX_WIDTH are still re-encoded, so the script is
 * idempotent and safe to run after every download.
 */

import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PREVIEWS_DIR = path.join(__dirname, '..', 'public', 'previews')

/**
 * Load sharp. Normally a plain import works, but under pnpm the direct
 * devDependency link can dangle while next's own optional sharp copy is
 * always present — resolve through next's package as a fallback.
 */
async function loadSharp() {
    try {
        return (await import('sharp')).default
    } catch {
        const requireFromNext = createRequire(
            realpathSync(path.join(__dirname, '..', 'node_modules', 'next', 'package.json')),
        )
        return requireFromNext('sharp')
    }
}

const sharp = await loadSharp()

const MAX_WIDTH = 1600

export async function optimizePreviewFile(file) {
    const input = path.join(PREVIEWS_DIR, file)
    const before = fs.statSync(input).size

    const output = await sharp(input)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .png({ palette: true, quality: 85, effort: 9, compressionLevel: 9 })
        .toBuffer()

    // Only replace when it actually helps — keeps the script safe to re-run.
    if (output.length < before) {
        fs.writeFileSync(input, output)
        return { file, before, after: output.length, resized: true }
    }
    return { file, before, after: before, resized: false }
}

export async function optimizeAllPreviews() {
    const files = fs.readdirSync(PREVIEWS_DIR).filter((f) => f.endsWith('.png'))
    const results = []
    for (const file of files) {
        results.push(await optimizePreviewFile(file))
    }
    return results
}

function formatKB(bytes) {
    return `${(bytes / 1024).toFixed(0)} KB`
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${path.resolve(process.argv[1])}`).href

if (isMain) {
    const results = await optimizeAllPreviews()
    let beforeTotal = 0
    let afterTotal = 0
    for (const { file, before, after } of results) {
        beforeTotal += before
        afterTotal += after
        console.log(`${file}: ${formatKB(before)} → ${formatKB(after)}`)
    }
    console.log(`\nTotal: ${formatKB(beforeTotal)} → ${formatKB(afterTotal)}`)
}
