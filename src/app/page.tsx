import Dispensary from '@/components/Dispensary'
import { buildHomeJsonLd } from '@/lib/structured-data'

export default function HomePage() {
    const jsonLd = buildHomeJsonLd()
    return (
        <>
            <script
                type="application/ld+json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD from typed static data
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Dispensary />
        </>
    )
}
