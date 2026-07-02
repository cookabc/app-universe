'use client'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function AppChrome({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
                {children}
            </main>
            <Footer />
        </>
    )
}
