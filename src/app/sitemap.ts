import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://app-universe.example.com'

    // Add all static routes
    const routes = [
        '',
        '/lang-converter',
        '/pricing',
        '/agischool',
        '/realtime-fund',
        '/duekeep',
        '/image-generator',
        '/typing-practice',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
    }))
}