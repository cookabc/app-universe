import type { MetadataRoute } from 'next'
import tools from '@/data/tools'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${SITE_URL}/privacy`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/terms`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
        url: `${SITE_URL}/t/${tool.id}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: tool.featured ? 0.8 : 0.6,
    }))

    return [...staticRoutes, ...toolRoutes]
}
