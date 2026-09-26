import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    turbopack: {},
    agentRules: false,
    images: {
        // Screenshots favor AVIF's compression; WebP remains the fallback.
        formats: ['image/avif', 'image/webp'],
        // Preview sources are capped at 1600px by scripts/optimize-previews.js,
        // so the variant ladder stops there instead of the 3840 default.
        deviceSizes: [640, 750, 828, 1080, 1200, 1600],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    async rewrites() {
        // Hidden puzzles room: /puzzles serves the static dashboard in public/.
        return [{ source: '/puzzles', destination: '/puzzles/index.html' }]
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
            {
                // Keep the hidden puzzles room out of search results.
                source: '/puzzles/:path*',
                headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
            },
        ]
    },
}

export default nextConfig
