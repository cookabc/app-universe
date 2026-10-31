import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: `Privacy policy for ${SITE_NAME}.`,
}

export default function PrivacyPage() {
    return (
        <section className="plain-page">
            <Link href="/" className="back-link caps">
                ← Back home
            </Link>
            <h1>Privacy Policy</h1>
            <p className="code">Last updated — July 17, 2026</p>
            <div className="prose mt-8">
                <p>
                    {SITE_NAME} does not collect personal data, run analytics, or serve advertising cookies. The site
                    only stores preferences on your device so the experience stays familiar between visits.
                </p>
                <p>Specifically, we may use:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-foreground">localStorage</strong> for theme preference (
                        <code className="text-xs">wayseeker-theme</code>)
                    </li>
                    <li>
                        <strong className="text-foreground">cookie / localStorage</strong> for language preference (
                        i18next)
                    </li>
                </ul>
                <p>
                    When you open a tool link, you leave this site and visit the tool provider&apos;s website. We are
                    not responsible for the privacy practices of external sites.
                </p>
                <p>
                    If this policy changes, we will update the date above. Questions:{' '}
                    <a
                        href="mailto:chuangcius@gmail.com"
                        className="text-foreground underline underline-offset-4 hover:opacity-70"
                    >
                        chuangcius@gmail.com
                    </a>
                    .
                </p>
            </div>
        </section>
    )
}
