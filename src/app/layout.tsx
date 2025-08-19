import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <ClerkProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <div className="flex flex-col min-h-screen bg-background">
                            <Header />
                            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
                            <Footer />
                        </div>
                        <Toaster />
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}
