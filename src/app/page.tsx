'use client'

import { AppGrid } from '@/components/AppGrid'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { Particles } from '@/components/Particles'
import apps from '@/data/apps'

export default function HomePage() {
    return (
        <main className="dark-mode">
            <Header />
            <Particles />
            <HeroSection />
            <AppGrid apps={apps} />
            <Footer />
        </main>
    )
}
