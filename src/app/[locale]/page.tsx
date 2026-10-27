import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import { ToolGrid } from '@/components/ToolGrid'
import { requireLocale } from '@/lib/locale-params'
import { getMessages } from '@/lib/messages'
import { buildPageMetadata } from '@/lib/seo'
import { buildHomeJsonLd } from '@/lib/structured-data'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = await requireLocale(params)
    const { meta } = getMessages(locale)
    return buildPageMetadata({
        locale,
        suffix: '/',
        title: meta.title,
        description: meta.description,
        absoluteTitle: true,
    })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await requireLocale(params)
    const { meta } = getMessages(locale)
    const jsonLd = buildHomeJsonLd(locale, meta.description)
    return (
        <div>
            {/* Static JSON-LD from curated site data (not user input). */}
            <script
                type="application/ld+json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD from typed static data
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero />
            <div id="tools" className="container max-w-7xl mx-auto scroll-mt-20 px-4 py-16 sm:py-20">
                <ToolGrid />
            </div>
        </div>
    )
}
