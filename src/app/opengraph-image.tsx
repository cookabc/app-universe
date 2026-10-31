import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import TOOLS from '@/data/tools'

export const alt = 'Wayseeker — Find your next tool'
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
                background: '#1b3a31',
                color: '#e9eadf',
                fontFamily: 'system-ui, sans-serif',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '42px 56px 0',
                    fontSize: 28,
                    fontWeight: 650,
                }}
            >
                <div style={{ display: 'flex', flexWrap: 'wrap', width: 30, height: 30, marginRight: 16, gap: 3 }}>
                    <div style={{ width: 13, height: 13, background: '#f5f5ef' }} />
                    <div style={{ width: 13, height: 13, background: '#f5f5ef' }} />
                    <div style={{ width: 13, height: 13, background: '#f5f5ef' }} />
                    <div style={{ width: 13, height: 13, background: '#b8321d' }} />
                </div>
                Wayseeker
                <div style={{ display: 'flex', marginLeft: 'auto', color: '#a9b9ae', fontSize: 17 }}>
                    A CABINET OF TOOLS
                </div>
            </div>
            <div
                style={{ display: 'flex', padding: '34px 56px 0', fontSize: 58, fontWeight: 500, letterSpacing: -2.4 }}
            >
                What are you settling for?
            </div>
            <div style={{ display: 'flex', padding: '20px 56px 0', color: '#a9b9ae', fontSize: 21 }}>
                Every tool filed against the habit it replaces.
            </div>
            <div style={{ display: 'flex', margin: '36px 56px 0', height: 302, border: '1px solid #2c4d42' }}>
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
                            borderRight: index === previews.length - 1 ? 'none' : '1px solid #2c4d42',
                        }}
                    />
                ))}
            </div>
            <div
                style={{ display: 'flex', margin: '26px 56px 0', alignItems: 'center', color: '#c9a35a', fontSize: 18 }}
            >
                Direction → System → Motion → Reference → Delivery
                <div style={{ display: 'flex', marginLeft: 'auto', color: '#a9b9ae', fontSize: 16 }}>
                    {TOOLS.length} TOOLS / ZH + EN
                </div>
            </div>
        </div>,
        { ...size },
    )
}
