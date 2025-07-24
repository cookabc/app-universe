import { Suspense } from 'react'
import { AppGrid } from '@/components/AppGrid'
import { CanvasDotGrid } from '@/components/canvas-dot-grid'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { StreamingLoader } from '@/components/optimized/loading'
import apps from '@/data/apps'

// Server Component with streaming optimizations
export default function HomePage() {
    return (
        <main className="bg-gradient-to-br from-gray-900 to-gray-700 text-white">
            <AppErrorBoundary>
                <StreamingLoader fallback={<div className="h-16 bg-gray-800/50 animate-pulse" />}>
                    <Header />
                </StreamingLoader>

                <CanvasDotGrid />

                <div className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                    <Suspense fallback={<div className="h-64 bg-gray-800/30 animate-pulse rounded-lg" />}>
                        <HeroSection />
                    </Suspense>

                    <Suspense
                        fallback={
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="h-48 bg-gray-800/30 animate-pulse rounded-xl" />
                                ))}
                            </div>
                        }
                    >
                        <AppGrid apps={apps} />
                    </Suspense>
                </div>

                <Footer />
            </AppErrorBoundary>
        </main>
    )
}
