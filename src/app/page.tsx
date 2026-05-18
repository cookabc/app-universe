'use client'

import HeroSection from '@/components/magicpath/nice-ui-landing-hero/HeroSection'
import { ToolGrid } from '@/components/ToolGrid'

export default function HomePage() {
    return (
        <div>
            <HeroSection />
            <div id="tools" className="container max-w-7xl mx-auto px-4 pb-12">
                <ToolGrid />
            </div>
        </div>
    )
}
