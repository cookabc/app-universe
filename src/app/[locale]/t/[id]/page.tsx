import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolDetail } from '@/components/ToolDetail'
import tools, { getRelatedTools, getToolById } from '@/data/tools'
import { isLocale, localePath } from '@/lib/locale'
import { getMessages } from '@/lib/messages'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_NAME, SITE_URL } from '@/lib/site'

interface PageProps {
    params: Promise<{ locale: string; id: string }>
}

export function generateStaticParams() {
    return tools.map((tool) => ({ id: tool.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale: rawLocale, id } = await params
    const locale = isLocale(rawLocale) ? rawLocale : 'en'
    const tool = getToolById(id)
    if (!tool) {
        const { notFound: copy } = getMessages(locale)
        return buildPageMetadata({
            locale,
            suffix: `/t/${id}`,
            title: copy.title,
            description: copy.body,
        })
    }

    const description = tool.note?.[locale] ?? tool.description[locale]
    return buildPageMetadata({
        locale,
        suffix: `/t/${tool.id}`,
        title: tool.name[locale],
        description,
    })
}

export default async function ToolPage({ params }: PageProps) {
    const { locale: rawLocale, id } = await params
    if (!isLocale(rawLocale)) notFound()
    const locale = rawLocale
    const tool = getToolById(id)
    if (!tool) notFound()

    const related = getRelatedTools(tool, 3)
    const otherLocale = locale === 'zh' ? 'en' : 'zh'
    const pageUrl = `${SITE_URL}${localePath(locale, `/t/${tool.id}`)}`
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: tool.name[locale],
        alternateName: tool.name[otherLocale] !== tool.name[locale] ? tool.name[otherLocale] : undefined,
        description: tool.note?.[locale] ?? tool.description[locale],
        url: pageUrl,
        inLanguage: locale,
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: `${SITE_URL}/${locale}`,
        },
        about: {
            '@type': 'SoftwareApplication',
            name: tool.name[locale],
            url: tool.url,
            applicationCategory: 'WebApplication',
            description: tool.description[locale],
            image: `${SITE_URL}/previews/${tool.id}.png`,
        },
    }

    return (
        <>
            {/* Static JSON-LD from curated tool data (not user input). */}
            <script
                type="application/ld+json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD from typed static data
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ToolDetail tool={tool} related={related} />
        </>
    )
}
