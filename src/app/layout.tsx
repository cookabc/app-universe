import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata = {
    title: 'AI Universe',
    description: 'Discover and use amazing AI-powered tools',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap" rel="stylesheet" />
            </head>
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
