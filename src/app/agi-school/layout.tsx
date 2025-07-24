import { Inter } from 'next/font/google'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'AGI School - Learn the Future of AI',
    description: 'Shaping the Future of Artificial General Intelligence',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={inter.className}>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    )
}
