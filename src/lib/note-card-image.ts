/**
 * Renders a curator note as a Signal Atlas share card (PNG) on a canvas.
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
    /** Accent color associated with the tool (fallback when preview missing). */
    color: string
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

/** Body font stack mirrors the site's sans fallbacks for CJK rendering. */
function bodyFont(size: number, weight: number, cjk: boolean): string {
    const stack = cjk
        ? '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif'
        : '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'
    return `${weight} ${size}px ${stack}`
}

function monoFont(size: number): string {
    return `${size}px "IBM Plex Mono", "JetBrains Mono", Menlo, monospace`
}

function displayFont(size: number, cjk: boolean): string {
    const stack = cjk
        ? '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif'
        : '"Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif'
    return `800 ${size}px ${stack}`
}

// Palette from DESIGN.md (light mode).
const BG = '#F9F9F8'
const SURFACE = '#FDFDFC'
const INK = '#21201C'
const MUTED = '#63635E'
const HAIRLINE = '#E2E1DE'
const SIGNAL = '#E54D2E'

export async function renderNoteCard(data: NoteCardData): Promise<HTMLCanvasElement> {
    const scale = 2 // retina output
    const width = 1200
    const margin = 56
    const padX = 72
    // Text must clear the card frame: margin + padding, minus a safety inset.
    const contentWidth = width - margin * 2 - padX * 2 - 8

    // Measure pass on a scratch context to compute height.
    const scratch = document.createElement('canvas').getContext('2d')
    if (!scratch) throw new Error('Canvas 2D context unavailable')

    const cjk = hasCjk(`${data.name} ${data.note}`)
    const nameFont = displayFont(44, cjk)
    const noteFont = bodyFont(34, 400, cjk)
    const labelFont = monoFont(20)
    const brandFont = monoFont(18)

    scratch.font = nameFont
    const nameLines = wrapText(data.name, contentWidth, (s) => scratch.measureText(s).width)
    scratch.font = noteFont
    const noteLines = wrapText(data.note, contentWidth, (s) => scratch.measureText(s).width)

    const quoteMarkH = 54
    const labelH = 26
    const nameH = nameLines.length * 52
    const noteH = noteLines.length * 50
    const footerH = 24
    const cardPadTop = 64
    const cardPadBottom = 56
    const gapAfterName = 28
    const gapAfterNote = 40

    const cardH =
        cardPadTop + quoteMarkH + labelH + 18 + nameH + gapAfterName + noteH + gapAfterNote + footerH + cardPadBottom
    const height = cardH + margin * 2

    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    ctx.scale(scale, scale)

    // Backdrop: cloud paper with faint signal grid.
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = 'rgba(16, 17, 20, 0.05)'
    ctx.lineWidth = 1
    for (let x = 0; x <= width; x += 48) {
        ctx.beginPath()
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, height)
        ctx.stroke()
    }
    for (let y = 0; y <= height; y += 48) {
        ctx.beginPath()
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(width, y + 0.5)
        ctx.stroke()
    }

    // Card: white surface, ink border, crisp offset shadow (Signal Atlas elevation).
    const cardX = margin
    const cardY = margin
    const cardW = width - margin * 2
    ctx.fillStyle = INK
    ctx.fillRect(cardX + 6, cardY + 6, cardW, cardH)
    ctx.fillStyle = SURFACE
    ctx.fillRect(cardX, cardY, cardW, cardH)
    ctx.strokeStyle = INK
    ctx.lineWidth = 3
    ctx.strokeRect(cardX + 1.5, cardY + 1.5, cardW - 3, cardH - 3)

    let y = cardY + cardPadTop

    // Coral quote mark tab, overlapping the card's top edge.
    const tabW = 64
    const tabH = 40
    const tabX = cardX + padX - 16
    ctx.fillStyle = SIGNAL
    ctx.fillRect(tabX, cardY - tabH / 2, tabW, tabH)
    ctx.fillStyle = SURFACE
    ctx.font = displayFont(40, false)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('”', tabX + tabW / 2, cardY + 2)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    // Label (mono, uppercase, signal coral).
    ctx.font = labelFont
    ctx.fillStyle = SIGNAL
    const labelText = data.label.toUpperCase()
    ctx.fillText(labelText, cardX + padX, y + quoteMarkH)
    y += quoteMarkH + labelH + 18

    // Tool name (display, ink).
    ctx.font = nameFont
    ctx.fillStyle = INK
    for (const line of nameLines) {
        ctx.fillText(line, cardX + padX, y + 40)
        y += 52
    }
    y += gapAfterName

    // Note body.
    ctx.font = noteFont
    ctx.fillStyle = INK
    for (const line of noteLines) {
        ctx.fillText(line, cardX + padX, y + 26)
        y += 50
    }
    y += gapAfterNote

    // Footer: hairline, attribution + accent swatch, brand.
    ctx.strokeStyle = HAIRLINE
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cardX + padX, y + 0.5)
    ctx.lineTo(cardX + cardW - padX, y + 0.5)
    ctx.stroke()
    y += 34

    ctx.font = brandFont
    ctx.fillStyle = MUTED
    const attribution = `${data.attributionLabel}, ${data.domain}`.toUpperCase()
    ctx.fillText(attribution, cardX + padX, y)

    ctx.fillStyle = data.color
    ctx.fillRect(cardX + cardW - padX - 20, y - 16, 20, 20)
    ctx.strokeStyle = INK
    ctx.lineWidth = 2
    ctx.strokeRect(cardX + cardW - padX - 19, y - 15, 18, 18)

    ctx.font = brandFont
    ctx.fillStyle = MUTED
    ctx.textAlign = 'center'
    ctx.fillText(data.brand.toUpperCase(), width / 2, cardY + cardH + 34)
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
