import { ImageResponse } from 'next/og'

export const alt = 'App Universe — Tools that actually work'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 80,
                background: 'linear-gradient(145deg, #0c0d10 0%, #171a21 55%, #1c2430 100%)',
                color: '#f5f5f4',
                fontFamily: 'system-ui, sans-serif',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 36,
                }}
            >
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 999,
                        border: '4px solid #f5f5f4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: 999,
                            background: '#f5f5f4',
                        }}
                    />
                </div>
                <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>App Universe</div>
            </div>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, maxWidth: 900, letterSpacing: -1.5 }}>
                Tools that actually work
            </div>
            <div style={{ marginTop: 24, fontSize: 28, color: '#a8a29e', maxWidth: 760 }}>
                A curated collection for design, productivity, animation, and more.
            </div>
        </div>,
        { ...size },
    )
}
