import Link from 'next/link'
import type { Locale } from '@/lib/locale'
import { localePath } from '@/lib/locale'
import { getMessages } from '@/lib/messages'

/** Server-rendered 404 body. The locale comes from the URL, not from the client. */
export function NotFoundView({ locale }: { locale: Locale }) {
    const { notFound: copy } = getMessages(locale)

    return (
        <section className="min-h-[70vh] flex items-center px-4">
            <div className="container max-w-7xl mx-auto">
                <p className="index-label mb-4">{copy.code}</p>
                <h1 className="display-heading text-5xl sm:text-6xl text-foreground mb-4 tracking-[-0.04em]">
                    {copy.title}
                </h1>
                <p className="measure text-base text-muted-foreground mb-8 leading-relaxed">{copy.body}</p>
                <Link
                    href={localePath(locale, '/')}
                    className="index-label index-label--foreground inline-block pb-1 border-b border-foreground hover:opacity-70 transition-opacity"
                >
                    {copy.cta} →
                </Link>
                <nav aria-label={copy.resources} className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="index-label">{copy.resources}</span>
                    <a
                        href="/sitemap.xml"
                        className="index-label inline-block pb-1 border-b border-transparent hover:border-foreground hover:text-foreground transition-colors"
                    >
                        sitemap.xml
                    </a>
                    <a
                        href="/llms.txt"
                        className="index-label inline-block pb-1 border-b border-transparent hover:border-foreground hover:text-foreground transition-colors"
                    >
                        llms.txt
                    </a>
                    <a
                        href="/tools.json"
                        className="index-label inline-block pb-1 border-b border-transparent hover:border-foreground hover:text-foreground transition-colors"
                    >
                        tools.json
                    </a>
                </nav>
            </div>
        </section>
    )
}
