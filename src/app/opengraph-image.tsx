import { ImageResponse } from 'next/og'

export const alt = 'App Universe — Tools that earn their place'
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
                background: '#F4F3EF',
                color: '#101114',
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
                        borderRadius: 4,
                        border: '4px solid #101114',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: 2,
                            background: '#315CFF',
                        }}
                    />
                </div>
                <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>App Universe</div>
            </div>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, maxWidth: 900, letterSpacing: -1.5 }}>
                Tools that earn their place
            </div>
            <div style={{ marginTop: 24, fontSize: 28, color: '#62636A', maxWidth: 760 }}>
                Curated signal for design, code, and creative work.
            </div>
        </div>,
        { ...size },
    )
}
