import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: `Terms of service for ${SITE_NAME}.`,
}

export default function TermsPage() {
    return (
        <section className="plain-page">
            <Link href="/" className="back-link caps">
                ← Back home
            </Link>
            <h1>Terms of Service</h1>
            <p className="code">Last updated — July 17, 2026</p>
            <div className="prose mt-8">
                <p>
                    {SITE_NAME} is a curated directory of third-party tools and resources. Links are provided for
                    convenience and informational purposes only.
                </p>
                <p>
                    We do not endorse, operate, or control the external tools listed. Use them at your own risk and
                    review each provider&apos;s terms of service and privacy policy. Tool availability, pricing, and
                    features may change or break without notice.
                </p>
                <p>
                    The content on this site is provided &quot;as is&quot; without warranties of any kind. We may
                    update, reorder, or remove listings at any time. Site branding, copy, and presentation remain the
                    property of {SITE_NAME}; third-party product names and trademarks belong to their respective owners.
                </p>
                <p>
                    Questions:{' '}
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
