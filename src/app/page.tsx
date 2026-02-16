import { Suspense } from 'react'
import { AppGrid } from '@/components/AppGrid'
import { CanvasDotGrid } from '@/components/canvas-dot-grid'
import { HeroSection } from '@/components/HeroSection'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'

export const dynamic = 'force-dynamic'

const ChatGPT = ({ className }: { className?: string }) => <span className={className}>ChatGPT</span>
const Claude = ({ className }: { className?: string }) => <span className={className}>Claude</span>
const DeepSeek = ({ className }: { className?: string }) => <span className={className}>DeepSeek</span>
const Qwen = ({ className }: { className?: string }) => <span className={className}>Qwen</span>

export default function HomePage() {
    return (
        <div>
            <CanvasDotGrid />
            <AppErrorBoundary>
                <div className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
                    <Suspense fallback={<div className="h-64 bg-muted/30 animate-pulse rounded-lg" />}>
                        <HeroSection />
                    </Suspense>
                </div>
            </AppErrorBoundary>

            <div className="container mx-auto my-40 px-4 text-center">
                <AppGrid />
            </div>

            <div className="container mx-auto my-20 sm:my-40 px-4 text-center">
                <h2 className="mt-16 sm:mt-60 mb-10 sm:mb-20 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Trusted by Developers at Leading AI Companies
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-4 text-gray-500 dark:text-gray-400">
                    <ChatGPT className="h-10 w-10 sm:h-16 sm:w-16" />
                    <Claude className="h-10 w-10 sm:h-16 sm:w-16" />
                    <DeepSeek className="h-10 w-10 sm:h-16 sm:w-16" />
                    <Qwen className="h-10 w-10 sm:h-16 sm:w-16" />
                </div>
            </div>
        </div>
    )
}
