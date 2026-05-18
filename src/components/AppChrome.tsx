'use client'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function AppChrome({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </>
    )
}
