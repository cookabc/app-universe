/**
 * Renders a curator note as a dispensary label (PNG) on a canvas.
 *
 * Light-mode palette is baked in on purpose: the card is meant to be pasted
 * into chats, docs, and social posts where a consistent light surface reads
 * best, independent of the site's current theme.
 */

export interface NoteCardData {
    /** Tool name, e.g. "Open Design". */
    name: string
    /** Curator note — the quotable payload. */
    note: string
    /** Tool domain, e.g. "open-design.ai". */
    domain: string
    /** Localized label above the quote, e.g. "Why I use it". */
    label: string
    /** Localized attribution prefix, e.g. "Curator's note". */
    attributionLabel: string
    /** Accent color associated with the tool (kept for callers; unused). */
    color?: string
    /** Drawer code, e.g. "C4". */
    code?: string
    /** Localized site brand line rendered at the bottom. */
    brand: string
}

const CJK_RE = /[㐀-鿿豈-﫿︰-﹏＀-￯]/u

/**
 * Wraps text to fit `maxWidth`. Splits on spaces when present, otherwise falls
 * back to grapheme-level wrapping so unspaced scripts (Chinese, Japanese) and
 * long URLs still break cleanly.
 */
export function wrapText(text: string, maxWidth: number, measure: (s: string) => number): string[] {
    const lines: string[] = []
    let line = ''

    const pushGraphemes = (word: string) => {
        for (const { segment } of new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(word)) {
            if (measure(line + segment) > maxWidth && line) {
                lines.push(line)
                line = ''
            }
            line += segment
        }
    }

    for (const paragraph of text.split('\n')) {
        line = ''
        for (const word of paragraph.split(' ')) {
            const candidate = line ? `${line} ${word}` : word
            if (measure(candidate) <= maxWidth) {
                line = candidate
            } else if (measure(word) <= maxWidth && !CJK_RE.test(word)) {
                // Whole word fits on a fresh line — standard Latin wrapping.
                lines.push(line)
                line = word
            } else {
                // Word is CJK, unspaced, or too long: fill the current line by
                // grapheme so mixed text stays dense and nothing overflows.
                const rest = line ? ` ${word}` : word
                pushGraphemes(rest)
            }
        }
        lines.push(line)
    }
    return lines
}

function hasCjk(text: string): boolean {
    return CJK_RE.test(text)
}

const SANS = '"Archivo", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif'
const MONO = '"Fragment Mono", ui-monospace, Menlo, monospace'

// Light dispensary palette, baked in so pasted cards read the same everywhere.
const LACQUER = '#1B3A31'
const PAPER = '#F5F5EF'
const INK = '#16201B'
const MUTED = '#4A564F'
const RULE = 'rgba(22, 32, 27, 0.18)'
const BRASS = '#C9A35A'
const SEAL = '#B8321D'

export async function renderNoteCard(data: NoteCardData): Promise<HTMLCanvasElement> {
    const scale = 2
    const width = 1200
    const margin = 64
    const pad = 72
    const contentWidth = width - margin * 2 - pad * 2

    const scratch = document.createElement('canvas').getContext('2d')
    if (!scratch) throw new Error('Canvas 2D context unavailable')

    const cjk = hasCjk(`${data.name} ${data.note}`)
    const nameFont = `800 ${cjk ? 60 : 72}px ${SANS}`
    const noteFont = `400 ${cjk ? 32 : 31}px ${SANS}`
    const labelFont = `500 18px ${MONO}`

    scratch.font = nameFont
    const nameText = cjk ? data.name : data.name.toUpperCase()
    const nameLines = wrapText(nameText, contentWidth, (s) => scratch.measureText(s).width)
    scratch.font = noteFont
    const noteLines = wrapText(data.note, contentWidth, (s) => scratch.measureText(s).width)

    const nameLh = cjk ? 72 : 74
    const noteLh = 48
    const cardH = 56 + 30 + 28 + nameLines.length * nameLh + 34 + noteLines.length * noteLh + 46 + 30 + 56
    const height = cardH + margin * 2

    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    ctx.scale(scale, scale)

    ctx.fillStyle = LACQUER
    ctx.fillRect(0, 0, width, height)

    const x = margin
    const y0 = margin
    const w = width - margin * 2
    ctx.fillStyle = PAPER
    ctx.fillRect(x, y0, w, cardH)
    ctx.strokeStyle = BRASS
    ctx.lineWidth = 3
    ctx.strokeRect(x + 14, y0 + 14, w - 28, cardH - 28)

    let y = y0 + 56 + 18
    ctx.font = labelFont
    ctx.fillStyle = SEAL
    ctx.fillText(data.code ? `${data.code}` : '', x + pad, y)
    ctx.fillStyle = MUTED
    ctx.textAlign = 'right'
    ctx.fillText(data.label.toUpperCase(), x + w - pad, y)
    ctx.textAlign = 'left'
    y += 30 + 28

    ctx.font = nameFont
    ctx.fillStyle = INK
    for (const line of nameLines) {
        y += nameLh
        ctx.fillText(line, x + pad, y - 14)
    }
    y += 6
    ctx.fillStyle = INK
    ctx.fillRect(x + pad, y, contentWidth, 2)
    y += 28

    ctx.font = noteFont
    ctx.fillStyle = INK
    for (const line of noteLines) {
        y += noteLh
        ctx.fillText(line, x + pad, y - 14)
    }
    y += 22
    ctx.fillStyle = RULE
    ctx.fillRect(x + pad, y, contentWidth, 1)
    y += 36

    ctx.font = labelFont
    ctx.fillStyle = MUTED
    ctx.fillText(`${data.attributionLabel}, ${data.domain}`.toUpperCase(), x + pad, y)
    ctx.textAlign = 'right'
    ctx.fillStyle = INK
    ctx.fillText(data.brand.toUpperCase(), x + w - pad, y)
    ctx.textAlign = 'left'

    return canvas
}

export type CopyImageResult = 'copied' | 'downloaded'

/**
 * Copies the rendered card to the clipboard as PNG. Falls back to a file
 * download when the async clipboard image API is unavailable (e.g. Firefox
 * or non-secure contexts).
 */
export async function copyCanvasAsImage(canvas: HTMLCanvasElement, filename: string): Promise<CopyImageResult> {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('PNG encoding failed')

    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            return 'copied'
        } catch {
            // Permission denied or transient failure — fall through to download.
        }
    }

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
    return 'downloaded'
}
