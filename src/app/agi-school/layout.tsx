import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { cn } from '@/lib/utils'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

export const metadata = {
    title: 'AGI School - Pioneering Artificial General Intelligence Education',
    description: 'Join us at AGI School to learn the latest in Artificial General Intelligence research and development. Shape the future of AI with our cutting-edge curriculum and expert instructors.',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn('font-sans antialiased', GeistSans.variable, GeistMono.variable)}>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}
