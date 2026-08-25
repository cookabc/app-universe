import Hero from '@/components/Hero'
import { ToolGrid } from '@/components/ToolGrid'
import { buildHomeJsonLd } from '@/lib/structured-data'

export default function HomePage() {
    const jsonLd = buildHomeJsonLd()
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
