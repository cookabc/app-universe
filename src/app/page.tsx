'use client'

import Hero from '@/components/Hero'
import { ToolGrid } from '@/components/ToolGrid'

export default function HomePage() {
    return (
        <div>
            <Hero />
            <div id="tools" className="container max-w-7xl mx-auto scroll-mt-20 px-4 py-16 sm:py-20">
                <ToolGrid />
            </div>
        </div>
    )
}
