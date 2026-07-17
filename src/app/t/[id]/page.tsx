import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolDetail } from '@/components/ToolDetail'
import tools, { getRelatedTools, getToolById } from '@/data/tools'
import { SITE_NAME, SITE_URL } from '@/lib/site'

interface PageProps {
    params: Promise<{ id: string }>
}

export function generateStaticParams() {
    return tools.map((tool) => ({ id: tool.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const tool = getToolById(id)
    if (!tool) {
        return { title: 'Tool not found' }
    }

    const title = tool.name.en
    const titleZh = tool.name.zh
    const descriptionEn = tool.note?.en ?? tool.description.en
    const descriptionZh = tool.note?.zh ?? tool.description.zh
    // Keep primary meta English for crawlers; include Chinese in OG for bilingual shares.
    const description = descriptionEn === descriptionZh ? descriptionEn : `${descriptionEn} / ${descriptionZh}`
    const path = `/t/${tool.id}`
    const preview = `${SITE_URL}/previews/${tool.id}.png`
    const fullTitle = title === titleZh ? title : `${title} · ${titleZh}`

    return {
        title: fullTitle,
        description,
        alternates: { canonical: path },
        openGraph: {
            title: `${fullTitle} — ${SITE_NAME}`,
            description,
            url: `${SITE_URL}${path}`,
            type: 'website',
            locale: 'en_US',
            alternateLocale: ['zh_CN'],
            siteName: SITE_NAME,
            images: [{ url: preview, width: 1200, height: 630, alt: `${title} preview` }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${fullTitle} — ${SITE_NAME}`,
            description,
            images: [preview],
        },
    }
}

export default async function ToolPage({ params }: PageProps) {
    const { id } = await params
    const tool = getToolById(id)
    if (!tool) notFound()

    const related = getRelatedTools(tool, 3)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: tool.name.en,
        alternateName: tool.name.zh !== tool.name.en ? tool.name.zh : undefined,
        description: tool.note?.en ?? tool.description.en,
        url: `${SITE_URL}/t/${tool.id}`,
        inLanguage: ['en', 'zh'],
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: SITE_URL,
        },
        about: {
            '@type': 'SoftwareApplication',
            name: tool.name.en,
            url: tool.url,
            applicationCategory: 'WebApplication',
            description: tool.description.en,
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
