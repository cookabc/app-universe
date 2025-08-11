'use client'

import { useEffect, useState } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { FloatingIcons } from './components/floating-icons'
import { Header } from './components/header'
import { HeroSection } from './components/hero-section'
import { ModuleList } from './components/module-list'
import { StorySection } from './components/story-section'

export default function PromptEngClient() {
    const [showStory, setShowStory] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => setShowStory(true), 1000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 1 : 0))
        }, 100)
        return () => clearInterval(interval)
    }, [])

    const toggleMute = () => {
        setIsMuted((prev) => !prev)
        // TODO: Add logic to control background music
    }

    return (
        <AppErrorBoundary>
            <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 relative overflow-hidden">
                <FloatingIcons />
                <Header isMuted={isMuted} toggleMute={toggleMute} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <HeroSection />
                    <StorySection showStory={showStory} progress={progress} />
                    <ModuleList />
                </main>
                <footer className="bg-card mt-12 relative z-10">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-muted-foreground text-sm">© 2024 Prompt训练营. 保留所有权利.</p>
                    </div>
                </footer>
            </div>
        </AppErrorBoundary>
    )
}
