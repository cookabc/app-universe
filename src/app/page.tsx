'use client'

import { Claude, DeepSeek, Gemini, Grok, Kimi, Minimax, OpenAI, Qwen, ZAI } from '@lobehub/icons'
import { Suspense, useEffect, useState } from 'react'
import { AppGrid } from '@/components/AppGrid'
import { CanvasDotGrid } from '@/components/canvas-dot-grid'
import { HeroSection } from '@/components/HeroSection'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { useTranslation } from 'react-i18next'

const ChatGPT = ({ className }: { className?: string }) => <OpenAI className={className} />
const ClaudeIcon = ({ className }: { className?: string }) => <Claude className={className} />
const DeepSeekIcon = ({ className }: { className?: string }) => <DeepSeek className={className} />
const QwenIcon = ({ className }: { className?: string }) => <Qwen className={className} />
const GeminiIcon = ({ className }: { className?: string }) => <Gemini className={className} />
const GrokIcon = ({ className }: { className?: string }) => <Grok className={className} />
const ZAIIcon = ({ className }: { className?: string }) => <ZAI className={className} />
const MinimaxIcon = ({ className }: { className?: string }) => <Minimax className={className} />
const KimiIcon = ({ className }: { className?: string }) => <Kimi className={className} />

export default function HomePage() {
    const { t } = useTranslation()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        setIsReady(true)
    }, [])

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

            <div className="container max-w-7xl mx-auto my-32 px-4 text-center">
                <AppGrid />
            </div>

            <div className="container max-w-7xl mx-auto my-20 sm:my-32 px-4 text-center">
                <h2 className="mt-16 sm:mt-60 mb-10 sm:mb-20 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {isReady ? t('trustedBy') : 'Trusted by Developers at Leading AI Companies'}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                    <div className="group flex flex-col items-center gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <ChatGPT className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div className="group flex flex-col items-center gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <ClaudeIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div className="group flex flex-col items-center gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <GeminiIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div className="group flex flex-col items-center gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <GrokIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div className="group flex flex-col items-center gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <ZAIIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div className="group flex flex-col items-center gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <MinimaxIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div className="group flex flex-col items-center gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <KimiIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div className="group flex flex-col items-center gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <DeepSeekIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div className="group flex flex-col items-center gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                            <QwenIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
