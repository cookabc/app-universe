'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Header } from './header'
import { FeaturesSection } from './features-section'
import { FreedomSection } from './freedom-section'

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="bg-[#f0fdf4] py-12 px-4 sm:px-8 lg:px-12 sm:py-16 md:py-24">
                <div className="mx-auto max-w-[1200px]">
                    <div className="rounded-[15px] border border-[#19192c] bg-white p-6 sm:p-8 lg:p-12">
                        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center">
                                <h1 className="text-3xl font-bold text-[#064e3b] sm:text-4xl lg:text-5xl xl:text-6xl">
                                    Unified Inference Platform
                                    <br />
                                    for any model, on any cloud
                                </h1>
                                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600">
                                    Build scalable AI systems with unparalleled speed and flexibility. Deploy in your
                                    cloud, iterate faster, and scale at a lower cost.
                                </p>
                                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4">
                                    <Button
                                        size="lg"
                                        className="rounded-full bg-[#8b5cf6] px-6 py-3 text-white hover:bg-[#7c3aed] border border-[#19192c] w-full sm:w-auto"
                                    >
                                        Get Started
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="rounded-full bg-[#064e3b] px-6 py-3 text-white hover:bg-[#064e3b]/90 border border-[#19192c] w-full sm:w-auto"
                                    >
                                        Bring Your Own Cloud
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center mt-8 lg:mt-0">
                                <div className="relative h-[300px] w-full max-w-[400px] lg:h-[400px] lg:w-[400px]">
                                    <svg
                                        width="100%"
                                        height="100%"
                                        viewBox="0 0 400 400"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect width="400" height="400" fill="#E5E7EB" />
                                        <path
                                            d="M200 100L300 150V250L200 300L100 250V150L200 100Z"
                                            fill="#9CA3AF"
                                            stroke="#4B5563"
                                            strokeWidth="4"
                                        />
                                        <path
                                            d="M200 150L250 175V225L200 250L150 225V175L200 150Z"
                                            fill="#6B7280"
                                            stroke="#4B5563"
                                            strokeWidth="4"
                                        />
                                        <circle cx="200" cy="200" r="20" fill="#10B981" />
                                        <path d="M180 220L220 180M180 180L220 220" stroke="#047857" strokeWidth="4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FeaturesSection />
            <FreedomSection />

            {/* Trusted By Section */}
            <section className="border-t border-gray-200 py-12 sm:py-16 md:py-24">
                <div className="mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-12">
                    <h2 className="text-center text-lg font-medium text-gray-600">
                        Trusted by visionary AI teams worldwide
                    </h2>
                    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                        {[
                            {
                                name: 'Neural Network',
                                color: '#FF6B6B',
                                path: 'M10 30 Q20 10 30 30 M10 10 Q20 30 30 10 M5 20 H35',
                            },
                            {
                                name: 'Data Analysis',
                                color: '#4ECDC4',
                                path: 'M5 35 L15 15 Q20 5 25 15 L35 5 M5 25 H35',
                            },
                            {
                                name: 'Cloud Computing',
                                color: '#45B7D1',
                                path: 'M10 25 Q20 5 30 25 Q20 45 10 25 M15 20 H25 M20 15 V25',
                            },
                            {
                                name: 'Machine Learning',
                                color: '#FF8C42',
                                path: 'M10 20 A10 10 0 1 0 30 20 A10 8 0 1 1 10 20 M15 20 H25',
                            },
                            {
                                name: 'Artificial Intelligence',
                                color: '#98CA32',
                                path: 'M20 5 L5 20 L20 35 L35 20 L20 5 M5 20 Q20 35 35 20',
                            },
                            {
                                name: 'Big Data',
                                color: '#925E78',
                                path: 'M5 15 H35 M5 25 H35 M13 7 V33 M28 7 V33 Q32 20 28 7',
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center transition-all hover:grayscale"
                            >
                                <svg
                                    width="80"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect width="40" height="40" rx="4" fill="#F3F4F6" />
                                    <path
                                        d={item.path}
                                        stroke={item.color}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="mt-2 text-xs text-gray-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
