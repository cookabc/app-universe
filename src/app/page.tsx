
import { Suspense } from 'react'
import { CanvasDotGrid } from '@/components/canvas-dot-grid'
import { HeroSection } from '@/components/HeroSection'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function HomePage() {
    return (
        <main className="bg-gray-900 text-white">
            <Header />
            <div className="bg-gray-900">
                <AppErrorBoundary>
                    <CanvasDotGrid />
                    <div className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                        <Suspense fallback={<div className="h-64 bg-gray-800/30 animate-pulse rounded-lg" />}>
                            <HeroSection />
                        </Suspense>
                    </div>
                </AppErrorBoundary>
            </div>
            <div className="bg-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="bg-gray-800 text-white">
                        <CardHeader>
                        <CardTitle>Prompt Lab</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p>Visually design, test, and version your prompts. Collaborate with your team and get instant feedback from various models.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader>
                        <CardTitle>AI Workbench</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p>An online IDE purpose-built for AI. Code, debug, and deploy your applications from a single, unified environment.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-800 text-white">
                        <CardHeader>
                        <CardTitle>Artifacts Showcase</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p>Create a stunning portfolio of your AI projects. Share your work with the world and build your personal brand.</p>
                        </CardContent>
                    </Card>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 py-20">
                <div className="container mx-auto px-4 text-center text-white">
                    <h3 className="text-3xl font-bold mb-4">Trusted by Developers at Leading AI Companies</h3>
                    <div className="flex justify-center space-x-8 text-gray-400">
                    <span>Company A</span>
                    <span>Company B</span>
                    <span>Company C</span>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
