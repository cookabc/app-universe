export const Footer = () => {
    return (
        <footer className="w-full mt-auto py-10 border-t border-border/60">
            <div className="container max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} App Universe</p>
                <nav aria-label="Legal" className="flex items-center gap-6 text-sm text-muted-foreground">
                    <a href="/privacy" className="hover:text-foreground transition-colors">
                        Privacy
                    </a>
                    <a href="/terms" className="hover:text-foreground transition-colors">
                        Terms
                    </a>
                    <a href="/" className="hover:text-foreground transition-colors">
                        Home
                    </a>
                </nav>
            </div>
        </footer>
    )
}
