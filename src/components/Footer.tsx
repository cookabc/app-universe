export const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer className="w-full mt-auto py-8 border-t-2 border-slate-800">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                <p>&copy; {year} App Universe. All rights reserved.</p>
            </div>
        </footer>
    )
}
