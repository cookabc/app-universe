#!/usr/bin/env node
/**
 * Download screenshot previews for all tools.
 * Usage: node scripts/download-previews.js
 *
 * Tries Microlink first, falls back to Thum.io.
 * Saves to public/previews/{toolId}.png
 */

import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PREVIEWS_DIR = path.join(__dirname, '..', 'public', 'previews')

// Import tools data
const toolsFile = path.join(__dirname, '..', 'src', 'data', 'tools.ts')
const toolsContent = fs.readFileSync(toolsFile, 'utf-8')

// Extract URLs from tools.ts using regex
const urlMatches = [...toolsContent.matchAll(/url:\s*['"](https?:\/\/[^'"]+)['"]/g)]
const idMatches = [...toolsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)]

const tools = idMatches
    .map((m, i) => ({
        id: m[1],
        url: urlMatches[i]?.[1],
    }))
    .filter((t) => t.url)

function fetchImage(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https:') ? https : http
        const req = client.get(url, { timeout: 25000 }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                fetchImage(res.headers.location).then(resolve).catch(reject)
                return
            }
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode}`))
                return
            }
            const chunks = []
            res.on('data', (chunk) => chunks.push(chunk))
            res.on('end', () => {
                const buffer = Buffer.concat(chunks)
                if (buffer.length < 100) {
                    reject(new Error('Response too small'))
                    return
                }
                // Verify it's a PNG
                if (buffer[0] === 0x89 && buffer[1] === 0x50) {
                    resolve(buffer)
                } else {
                    reject(new Error('Not a PNG image'))
                }
            })
        })
        req.on('error', reject)
        req.on('timeout', () => {
            req.destroy()
            reject(new Error('Timeout'))
        })
    })
}

function getMicrolinkUrl(targetUrl) {
    return `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&embed=screenshot.url`
}

function getThumUrl(targetUrl) {
    return `https://image.thum.io/get/width/600/crop/800/${encodeURIComponent(targetUrl)}`
}

async function downloadPreview(tool, index) {
    const outputPath = path.join(PREVIEWS_DIR, `${tool.id}.png`)

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
        console.log(`[${index + 1}/${tools.length}] ⏭️  ${tool.id} (exists)`)
        return
    }

    console.log(`[${index + 1}/${tools.length}] 📥 ${tool.id} - ${tool.url}`)

    // Try Microlink
    try {
        const buffer = await fetchImage(getMicrolinkUrl(tool.url))
        fs.writeFileSync(outputPath, buffer)
        console.log(`   ✅ Microlink`)
        return
    } catch (err) {
        console.log(`   ⚠️  Microlink failed: ${err.message}`)
    }

    // Try Thum.io
    try {
        const buffer = await fetchImage(getThumUrl(tool.url))
        fs.writeFileSync(outputPath, buffer)
        console.log(`   ✅ Thum.io`)
        return
    } catch (err) {
        console.log(`   ❌ Thum.io failed: ${err.message}`)
    }
}

async function main() {
    if (!fs.existsSync(PREVIEWS_DIR)) {
        fs.mkdirSync(PREVIEWS_DIR, { recursive: true })
    }

    console.log(`Downloading ${tools.length} previews...\n`)

    // Download sequentially to avoid rate limiting
    for (let i = 0; i < tools.length; i++) {
        await downloadPreview(tools[i], i)
        // Small delay between requests
        await new Promise((r) => setTimeout(r, 500))
    }

    // Fresh screenshots are full-resolution PNGs — normalize them so the
    // previews directory never regrows to tens of megabytes.
    console.log('\nOptimizing previews...')
    const { optimizeAllPreviews } = await import('./optimize-previews.js')
    for (const { file, before, after } of await optimizeAllPreviews()) {
        if (after < before) console.log(`   ${file}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`)
    }

    console.log('\nDone!')
}

main().catch(console.error)
