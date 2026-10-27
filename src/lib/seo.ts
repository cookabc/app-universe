import type { Metadata, MetadataRoute } from 'next'
import tools from '../data/tools.ts'
import { LOCALES, type Locale, localePath } from './locale.ts'
import { SITE_NAME, SITE_URL } from './site.ts'

const OG_LOCALE: Record<Locale, string> = {
    en: 'en_US',
    zh: 'zh_CN',
}

/** Canonical path plus hreflang alternates for one locale-stripped suffix (`/` , `/privacy`, `/t/id`). */
export function buildLanguageAlternates(locale: Locale, suffix: string): NonNullable<Metadata['alternates']> {
    const canonical = localePath(locale, suffix)
    return {
        canonical,
        languages: {
            en: localePath('en', suffix),
            zh: localePath('zh', suffix),
            'x-default': localePath('en', suffix),
        },
    }
}

export function buildPageMetadata(input: {
    locale: Locale
    /** Locale-stripped path: `/` for home, `/privacy`, `/t/:id`. */
    suffix: string
    title: string
    description: string
    /** Home titles already include the site name; skip the `%s — Site` template. */
    absoluteTitle?: boolean
}): Metadata {
    const alternates = buildLanguageAlternates(input.locale, input.suffix)
    const canonical =
        typeof alternates.canonical === 'string' ? alternates.canonical : localePath(input.locale, input.suffix)
    const socialTitle = input.absoluteTitle ? input.title : `${input.title} — ${SITE_NAME}`
    const otherLocale = input.locale === 'zh' ? 'en' : 'zh'

    return {
        title: input.absoluteTitle ? { absolute: input.title } : input.title,
        description: input.description,
        alternates,
        openGraph: {
            title: socialTitle,
            description: input.description,
            url: `${SITE_URL}${canonical}`,
            siteName: SITE_NAME,
            type: 'website',
            locale: OG_LOCALE[input.locale],
            alternateLocale: [OG_LOCALE[otherLocale]],
        },
        twitter: {
            card: 'summary_large_image',
            title: socialTitle,
            description: input.description,
        },
    }
}

interface SitemapShape {
    suffix: string
    changeFrequency: 'weekly' | 'yearly' | 'monthly'
    priority: number
}

/** Both languages are first-class URLs. Legacy unprefixed paths stay out of the sitemap. */
export function buildSitemapEntries(lastModified: Date): MetadataRoute.Sitemap {
    const pages: SitemapShape[] = [
        { suffix: '/', changeFrequency: 'weekly', priority: 1 },
        { suffix: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
        { suffix: '/terms', changeFrequency: 'yearly', priority: 0.3 },
        ...tools.map((tool) => ({
            suffix: `/t/${tool.id}`,
            changeFrequency: 'monthly' as const,
            priority: tool.featured ? 0.8 : 0.6,
        })),
    ]

    return pages.flatMap((page) =>
        LOCALES.map((locale) => {
            const languages = {
                en: `${SITE_URL}${localePath('en', page.suffix)}`,
                zh: `${SITE_URL}${localePath('zh', page.suffix)}`,
                'x-default': `${SITE_URL}${localePath('en', page.suffix)}`,
            }
            return {
                url: `${SITE_URL}${localePath(locale, page.suffix)}`,
                lastModified,
                changeFrequency: page.changeFrequency,
                priority: page.priority,
                alternates: { languages },
            }
        }),
    )
}
