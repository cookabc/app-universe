import type { Locale } from './locale.ts'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './site.ts'

/**
 * JSON-LD identity graph for the homepage: WebSite + Organization so agents can
 * resolve the brand name to the canonical domain programmatically.
 */
export function buildHomeJsonLd(locale: Locale, description: string = SITE_DESCRIPTION): Record<string, unknown> {
    const pageUrl = `${SITE_URL}/${locale}`
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${pageUrl}/#website`,
                name: SITE_NAME,
                url: pageUrl,
                description,
                inLanguage: locale,
                publisher: { '@id': `${SITE_URL}/#organization` },
            },
            {
                '@type': 'Organization',
                '@id': `${SITE_URL}/#organization`,
                name: SITE_NAME,
                url: SITE_URL,
                description: SITE_DESCRIPTION,
                email: 'chuangcius@gmail.com',
                logo: {
                    '@type': 'ImageObject',
                    url: `${SITE_URL}/icon.svg`,
                },
            },
        ],
    }
}
