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
            <div className="explorer-container">
                <ToolGrid />
            </div>
        </div>
    )
}
