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
    const description = tool.note?.en ?? tool.description.en
    const path = `/t/${tool.id}`
    const preview = `${SITE_URL}/previews/${tool.id}.png`

    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            title: `${title} — ${SITE_NAME}`,
            description,
            url: `${SITE_URL}${path}`,
            type: 'website',
            images: [{ url: preview, width: 1200, height: 630, alt: `${title} preview` }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} — ${SITE_NAME}`,
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
        description: tool.note?.en ?? tool.description.en,
        url: `${SITE_URL}/t/${tool.id}`,
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
