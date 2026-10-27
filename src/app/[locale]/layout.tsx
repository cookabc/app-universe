import type { Metadata, Viewport } from 'next'
import { SiteShell } from '@/components/SiteShell'
import { requireLocale } from '@/lib/locale-params'
import { getMessages } from '@/lib/messages'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import '../globals.css'

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f9f9f8' },
        { media: '(prefers-color-scheme: dark)', color: '#18191b' },
    ],
    width: 'device-width',
    initialScale: 1,
}

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'zh' }]
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = await requireLocale(params)
    const { meta } = getMessages(locale)
    return {
        metadataBase: new URL(SITE_URL),
        applicationName: SITE_NAME,
        title: {
            default: meta.title,
            template: `%s — ${SITE_NAME}`,
        },
        description: meta.description,
    }
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const locale = await requireLocale(params)
    return <SiteShell locale={locale}>{children}</SiteShell>
}
