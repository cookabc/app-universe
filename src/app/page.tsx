'use client'

import { Claude, DeepSeek, Gemini, Grok, Kimi, Minimax, OpenAI, Qwen, ZAI } from '@lobehub/icons'
import { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppGrid } from '@/components/AppGrid'
import { CanvasDotGrid } from '@/components/canvas-dot-grid'
import { HeroSection } from '@/components/HeroSection'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'

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
                    <Suspense
                        fallback={
                            <div
                                className="h-64 bg-muted/30 animate-pulse rounded-lg"
                                role="status"
                                aria-label="Loading hero section"
                                aria-busy="true"
                            />
                        }
                    >
                        <HeroSection />
                    </Suspense>
                </div>
            </AppErrorBoundary>

            <div className="container max-w-7xl mx-auto my-32 px-4 text-center">
                <AppGrid />
            </div>

            <section
                className="container max-w-7xl mx-auto my-20 sm:my-32 px-4 text-center"
                aria-labelledby="partners-heading"
            >
                <h2
                    id="partners-heading"
                    className="mt-16 sm:mt-60 mb-10 sm:mb-20 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100"
                >
                    <span aria-live="polite" aria-atomic="true">
                        {isReady ? t('trustedBy') : 'Trusted by Developers at Leading AI Companies'}
                    </span>
                </h2>
                <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                    <li className="group flex flex-col items-center gap-2 min-w-[80px]">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 min-h-[64px] min-w-[64px] flex items-center justify-center"
                            title="OpenAI ChatGPT"
                        >
                            <ChatGPT
                                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">ChatGPT</span>
                    </li>
                    <li className="group flex flex-col items-center gap-2 min-w-[80px]">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 min-h-[64px] min-w-[64px] flex items-center justify-center"
                            title="Claude"
                        >
                            <ClaudeIcon
                                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Claude</span>
                    </li>
                    <li className="group flex flex-col items-center gap-2 min-w-[80px]">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 min-h-[64px] min-w-[64px] flex items-center justify-center"
                            title="Google Gemini"
                        >
                            <GeminiIcon
                                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Gemini</span>
                    </li>
                    <li className="group flex flex-col items-center gap-2 min-w-[80px]">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 min-h-[64px] min-w-[64px] flex items-center justify-center"
                            title="xAI Grok"
                        >
                            <GrokIcon
                                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Grok</span>
                    </li>
                    <li className="group flex flex-col items-center gap-2 min-w-[80px]">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 min-h-[64px] min-w-[64px] flex items-center justify-center"
                            title="ZAI"
                        >
                            <ZAIIcon
                                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">ZAI</span>
                    </li>
                    <li className="group flex flex-col items-center gap-2 min-w-[80px]">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 min-h-[64px] min-w-[64px] flex items-center justify-center"
                            title="Minimax"
                        >
                            <MinimaxIcon
                                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Minimax</span>
                    </li>
                    <li className="group flex flex-col items-center gap-2 min-w-[80px]">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 min-h-[64px] min-w-[64px] flex items-center justify-center"
                            title="Kimi"
                        >
                            <KimiIcon
                                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Kimi</span>
                    </li>
                    <li className="group flex flex-col items-center gap-2 min-w-[80px]">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 min-h-[64px] min-w-[64px] flex items-center justify-center"
                            title="DeepSeek"
                        >
                            <DeepSeekIcon
                                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                            DeepSeek
                        </span>
                    </li>
                    <li className="group flex flex-col items-center gap-2 min-w-[80px]">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 min-h-[64px] min-w-[64px] flex items-center justify-center"
                            title="Qwen"
                        >
                            <QwenIcon
                                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 dark:text-gray-300"
                                aria-hidden="true"
                            />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Qwen</span>
                    </li>
                </ul>
            </section>
        </div>
    )
}
