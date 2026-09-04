import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    turbopack: {},
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
