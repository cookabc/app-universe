import Link from 'next/link'

export const metadata = {
    title: 'Terms of Service — App Universe',
    description: 'Terms of service for App Universe.',
}

export default function TermsPage() {
    return (
        <section className="mx-auto max-w-2xl px-4 py-12">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back home
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mt-4 mb-6">Terms of Service</h1>
            <div className="text-muted-foreground space-y-4 leading-relaxed">
                <p>
                    App Universe is a curated directory of third-party tools and resources. All links are provided for
                    convenience and informational purposes only.
                </p>
                <p>
                    We do not endorse, operate, or control any of the external tools listed. Use them at your own risk
                    and review their respective terms of service and privacy policies.
                </p>
                <p>
                    The content on this site is provided "as is" without warranties of any kind. We may update or remove
                    listings at any time without notice.
                </p>
            </div>
        </section>
    )
}
