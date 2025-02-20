'use client'

import { AppGrid } from '@/components/AppGrid'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { CanvasDotGrid } from '@/components/canvas-dot-grid'
import apps from '@/data/apps'

export default function HomePage() {
    return (
        <main className="bg-linear-to-br from-gray-900 to-gray-700 text-white">
            <Header />
            <CanvasDotGrid />
            <div className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                <HeroSection />
                <AppGrid apps={apps} />
            </div>
            <Footer />
        </main>
    )
}
