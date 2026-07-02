import Link from 'next/link'

export const metadata = {
    title: 'Privacy Policy — App Universe',
    description: 'Privacy policy for App Universe.',
}

export default function PrivacyPage() {
    return (
        <section className="mx-auto max-w-2xl px-4 py-12">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back home
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mt-4 mb-6">Privacy Policy</h1>
            <div className="text-muted-foreground space-y-4 leading-relaxed">
                <p>
                    App Universe does not collect personal data. The site only uses essential cookies and local storage
                    to remember your theme preference and language selection.
                </p>
                <p>
                    When you click a tool link, you are redirected to the tool provider's website. We are not
                    responsible for the privacy practices of external sites.
                </p>
                <p>
                    We do not use analytics, trackers, or advertising cookies. If this changes, we will update this
                    policy.
                </p>
            </div>
        </section>
    )
}
