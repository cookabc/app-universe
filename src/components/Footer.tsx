export const Footer = () => {
    return (
        <footer className="w-full mt-auto py-8 border-t border-slate-200 dark:border-slate-800 transition-all duration-300">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                <p>© {new Date().getFullYear()} App Universe</p>
            </div>
        </footer>
    )
}
