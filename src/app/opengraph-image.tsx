import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import TOOLS from '@/data/tools'

export const alt = 'Wayfinder — Find your next tool'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
    const featured = TOOLS.filter((tool) => tool.featured).slice(0, 4)
    const previews = await Promise.all(
        featured.map(async (tool) => {
            const file = await readFile(join(process.cwd(), 'public', 'previews', `${tool.id}.png`))
            return `data:image/png;base64,${file.toString('base64')}`
        }),
    )

    return new ImageResponse(
        <div
            style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                background: '#111927',
                color: '#eeeeec',
                fontFamily: 'system-ui, sans-serif',
            }}
        >
            <div
                style={{ display: 'flex', alignItems: 'center', padding: '42px 56px 0', fontSize: 28, fontWeight: 650 }}
            >
                <div style={{ display: 'flex', color: '#eac561', marginRight: 18, fontSize: 38 }}>⌃</div>
                Wayfinder
                <div style={{ display: 'flex', marginLeft: 'auto', color: '#b5b3ad', fontSize: 17 }}>
                    A FIELD GUIDE FOR WHAT COMES NEXT
                </div>
            </div>
            <div
                style={{ display: 'flex', padding: '34px 56px 0', fontSize: 58, fontWeight: 500, letterSpacing: -2.4 }}
            >
                Find your next tool.
            </div>
            <div style={{ display: 'flex', padding: '20px 56px 0', color: '#b5b3ad', fontSize: 21 }}>
                Follow the work, not the leaderboard.
            </div>
            <div style={{ display: 'flex', margin: '36px 56px 0', height: 302, border: '1px solid #363a3f' }}>
                {previews.map((src, index) => (
                    <img
                        key={featured[index].id}
                        src={src}
                        alt=""
                        width={272}
                        height={302}
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'top',
                            borderRight: index === previews.length - 1 ? 'none' : '1px solid #363a3f',
                        }}
                    />
                ))}
            </div>
            <div
                style={{ display: 'flex', margin: '26px 56px 0', alignItems: 'center', color: '#eac561', fontSize: 18 }}
            >
                Direction → System → Motion → Reference → Delivery
                <div style={{ display: 'flex', marginLeft: 'auto', color: '#b5b3ad', fontSize: 16 }}>
                    31 TOOLS / ZH + EN
                </div>
            </div>
        </div>,
        { ...size },
    )
}
