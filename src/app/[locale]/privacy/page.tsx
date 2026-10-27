import type { Metadata } from 'next'
import Link from 'next/link'
import { fillTemplate, localePath } from '@/lib/locale'
import { requireLocale } from '@/lib/locale-params'
import { getMessages } from '@/lib/messages'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_NAME } from '@/lib/site'

const CONTACT_EMAIL = 'chuangcius@gmail.com'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = await requireLocale(params)
    const { legal } = getMessages(locale)
    return buildPageMetadata({
        locale,
        suffix: '/privacy',
        title: legal.privacyTitle,
        description: legal.privacyDescription,
    })
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await requireLocale(params)
    const { legal } = getMessages(locale)
    const site = { site: SITE_NAME }

    return (
        <section className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
            <Link href={localePath(locale, '/')} className="index-label hover:text-foreground transition-colors">
                {legal.backHome}
            </Link>
            <h1 className="display-heading text-4xl sm:text-5xl tracking-[-0.04em] text-foreground mt-6 mb-3">
                {legal.privacyTitle}
            </h1>
            <p className="index-label mb-10">{legal.updated}</p>
            <div className="measure text-muted-foreground space-y-5 leading-relaxed">
                <p>{fillTemplate(legal.privacyIntro, site)}</p>
                <p>{legal.privacySpecifically}</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-foreground">localStorage</strong> {legal.privacyTheme} (
                        <code className="text-xs">app-universe-theme</code>)
                    </li>
                    <li>
                        <strong className="text-foreground">cookie / localStorage</strong> {legal.privacyLanguage} (
                        i18next)
                    </li>
                </ul>
                <p>{legal.privacyExternal}</p>
                <p>
                    {legal.privacyChanges} {legal.questionsLead}{' '}
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-foreground underline underline-offset-4 hover:opacity-70"
                    >
                        {CONTACT_EMAIL}
                    </a>
                    .
                </p>
            </div>
        </section>
    )
}
