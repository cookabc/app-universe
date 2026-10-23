import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import TOOLS, { getAllTags } from '@/data/tools'

export const alt = 'App Universe — Tools that earn their place'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#f9f9f8'
const INK = '#21201c'
const MUTED = '#63635e'
const HAIRLINE = '#e2e1de'
const ACCENT = '#e2f0bd'
const SIGNAL = '#e54d2e'

const V_LINE_KEYS = 'abcdefghijklmnopqrstuvwx'.split('')
const H_LINE_KEYS = 'abcdefghijkl'.split('')

export default async function OpenGraphImage() {
    const featured = TOOLS.filter((tool) => tool.featured).slice(0, 6)
    const previews = await Promise.all(
        featured.map(async (tool) => {
            const file = await readFile(join(process.cwd(), 'public', 'previews', `${tool.id}.png`))
            return `data:image/png;base64,${file.toString('base64')}`
        }),
    )
    const stats = `${TOOLS.length} TOOLS / ${getAllTags(TOOLS).length} TAGS / ZH + EN`

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
            {V_LINE_KEYS.map((key, i) => (
                <div
                    key={`v-${key}`}
                    style={{
                        position: 'absolute',
                        left: (i + 1) * 48,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        background: '#d9d9e0',
                    }}
                />
            ))}
            {H_LINE_KEYS.map((key, i) => (
                <div
                    key={`h-${key}`}
                    style={{
                        position: 'absolute',
                        top: (i + 1) * 48,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: '#d9d9e0',
                    }}
                />
            ))}

            <div style={{ position: 'absolute', left: 66, top: 66, width: 1088, height: 518, background: INK }} />
            <div
                style={{
                    position: 'absolute',
                    left: 56,
                    top: 56,
                    width: 1088,
                    height: 518,
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#fdfdfc',
                    border: `3px solid ${INK}`,
                    padding: 48,
                }}
            >
                <div style={{ display: 'flex', fontSize: 20, letterSpacing: 6, color: SIGNAL }}>
                    HUMAN-CURATED FIELD GUIDE
                </div>
                <div
                    style={{
                        marginTop: 26,
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 62,
                        fontWeight: 800,
                        lineHeight: 1.05,
                        letterSpacing: -2,
                        color: INK,
                    }}
                >
                    <div style={{ display: 'flex' }}>Discover tools that</div>
                    <div style={{ display: 'flex', marginTop: 10 }}>
                        <div
                            style={{
                                display: 'flex',
                                background: ACCENT,
                                color: INK,
                                padding: '2px 16px 6px',
                                border: `3px solid ${INK}`,
                                transform: 'rotate(-1.5deg)',
                            }}
                        >
                            earn their place.
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 22, display: 'flex', fontSize: 25, color: MUTED }}>
                    A hand-curated field guide for design, code, and creative work.
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            border: `2px solid ${INK}`,
                            background: HAIRLINE,
                        }}
                    >
                        {previews.map((src, i) => (
                            <img
                                key={featured[i].id}
                                alt=""
                                src={src}
                                width={163}
                                height={92}
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                    marginRight: i === previews.length - 1 ? 0 : 2,
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ marginTop: 22, display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                background: ACCENT,
                                border: `3px solid ${INK}`,
                            }}
                        >
                            <div style={{ width: 16, height: 16, borderRadius: 2, background: INK }} />
                        </div>
                        <div style={{ display: 'flex', marginLeft: 14, fontSize: 26, fontWeight: 700, color: INK }}>
                            App Universe
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                marginLeft: 'auto',
                                fontSize: 18,
                                letterSpacing: 3,
                                color: MUTED,
                            }}
                        >
                            {stats}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        { ...size },
    )
}
