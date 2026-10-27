import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import TOOLS, { formatToolNumber, getToolById, getToolNumber } from '@/data/tools'
import { getDomain } from '@/lib/filter-tools'

export const alt = 'App Universe — archive record'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#F9F9F8'
const INK = '#21201C'
const MUTED = '#63635E'
const ACCENT = '#E2F0BD'
const SIGNAL = '#E54D2E'

export function generateStaticParams() {
    return TOOLS.map((tool) => ({ id: tool.id }))
}

export default async function ToolOpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const tool = getToolById(id)
    if (!tool) notFound()

    const domain = getDomain(tool.url)
    const entryNo = formatToolNumber(getToolNumber(tool.id))
    const note = tool.note?.en ?? tool.description.en
    const cutAt = note.lastIndexOf(' ', 150)
    const excerpt = note.length > 150 ? `${note.slice(0, cutAt > 80 ? cutAt : 150).trimEnd()}…` : note

    const file = await readFile(join(process.cwd(), 'public', 'previews', `${tool.id}.png`))
    const preview = `data:image/png;base64,${file.toString('base64')}`

    return new ImageResponse(
        <div
            style={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                height: '100%',
                background: BG,
                fontFamily: 'system-ui, sans-serif',
            }}
        >
            <div style={{ position: 'absolute', left: 62, top: 62, width: 1096, height: 526, background: INK }} />
            <div
                style={{
                    position: 'absolute',
                    left: 52,
                    top: 52,
                    width: 1096,
                    height: 526,
                    display: 'flex',
                    background: '#FDFDFC',
                    border: `3px solid ${INK}`,
                    padding: 44,
                    gap: 40,
                }}
            >
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ display: 'flex', fontSize: 19, letterSpacing: 5, color: SIGNAL }}>
                        {`ARCHIVE RECORD ${entryNo}`}
                    </div>
                    <div
                        style={{
                            marginTop: 24,
                            display: 'flex',
                            fontSize: 56,
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: -1.5,
                            color: INK,
                            maxHeight: 120,
                            overflow: 'hidden',
                        }}
                    >
                        {tool.name.en}
                    </div>
                    <div style={{ marginTop: 14, display: 'flex', fontSize: 20, letterSpacing: 3, color: MUTED }}>
                        {domain.toUpperCase()}
                    </div>
                    <div style={{ marginTop: 26, display: 'flex', fontSize: 22, lineHeight: 1.45, color: INK }}>
                        {excerpt}
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 36,
                                height: 36,
                                background: ACCENT,
                                border: `3px solid ${INK}`,
                            }}
                        >
                            <div style={{ width: 14, height: 14, borderRadius: 2, background: INK }} />
                        </div>
                        <div style={{ display: 'flex', marginLeft: 12, fontSize: 22, fontWeight: 700, color: INK }}>
                            App Universe
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                marginLeft: 'auto',
                                fontSize: 16,
                                letterSpacing: 3,
                                color: MUTED,
                            }}
                        >
                            ZH / EN
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        width: 400,
                        height: '100%',
                        border: `3px solid ${INK}`,
                        background: BG,
                    }}
                >
                    <img
                        alt=""
                        src={preview}
                        width={394}
                        height={432}
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                </div>
            </div>
        </div>,
        { ...size },
    )
}
