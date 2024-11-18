'use client'

import { AppGrid } from '@/components/AppGrid'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { Particles } from '@/components/Particles'
import apps from '@/data/apps'

export default function HomePage() {
    return (
        <main className="bg-gradient-to-br from-gray-900 to-gray-700 text-white">
            <Header />
            <Particles />
            <HeroSection />
            <AppGrid apps={apps} />
            <Footer />
        </main>
    )
}
