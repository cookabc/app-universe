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
        suffix: '/terms',
        title: legal.termsTitle,
        description: legal.termsDescription,
    })
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await requireLocale(params)
    const { legal } = getMessages(locale)
    const site = { site: SITE_NAME }

    return (
        <section className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
            <Link href={localePath(locale, '/')} className="index-label hover:text-foreground transition-colors">
                {legal.backHome}
            </Link>
            <h1 className="display-heading text-4xl sm:text-5xl tracking-[-0.04em] text-foreground mt-6 mb-3">
                {legal.termsTitle}
            </h1>
            <p className="index-label mb-10">{legal.updated}</p>
            <div className="measure text-muted-foreground space-y-5 leading-relaxed">
                <p>{fillTemplate(legal.termsIntro, site)}</p>
                <p>{legal.termsRisk}</p>
                <p>{fillTemplate(legal.termsWarranty, site)}</p>
                <p>
                    {legal.questionsLead}{' '}
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
