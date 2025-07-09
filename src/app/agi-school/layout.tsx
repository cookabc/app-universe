import { Inter } from 'next/font/google'
import Head from 'next/head'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'AGI School',
    description: 'Shaping the Future of Artificial General Intelligence',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Head>
                <title>AGI School - Learn the Future of AI</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
