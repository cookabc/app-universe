import type { Metadata } from 'next'
import { NotFoundView } from '@/components/NotFoundView'
import { SiteShell } from '@/components/SiteShell'
import { getMessages } from '@/lib/messages'
import { requestLocale } from '@/lib/request-locale'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
    const locale = await requestLocale()
    const { notFound: copy } = getMessages(locale)
    return {
        metadataBase: new URL(SITE_URL),
        title: `${copy.title} — ${SITE_NAME}`,
        description: copy.body,
        robots: { index: false, follow: false },
    }
}

/**
 * Unmatched URLs cannot render inside the `[locale]` root layout, so this
 * document is the 404. The proxy stamps `x-locale` from the URL first.
 */
export default async function GlobalNotFound() {
    const locale = await requestLocale()
    return (
        <SiteShell locale={locale}>
            <NotFoundView locale={locale} />
        </SiteShell>
    )
}
