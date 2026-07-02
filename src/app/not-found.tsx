import Link from 'next/link'

export default function NotFound() {
    return (
        <section className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <p className="text-sm font-medium text-primary mb-2">404</p>
                <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">Page not found</h1>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius)] bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                    Go back home
                </Link>
            </div>
        </section>
    )
}
