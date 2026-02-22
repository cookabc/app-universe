'use client'

import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { ImageDisplay } from './components/ImageDisplay'
import { ImageGeneratorForm } from './components/ImageGeneratorForm'
import { ProviderStatus } from './components/ProviderStatus'
import { QueueStatus } from './components/QueueStatus'
import { useImageGeneration } from './hooks/useImageGeneration'

export default function ImageGeneratorClient() {
    const {
        prompt,
        negativePrompt,
        generatedImage,
        requestStatus,
        queueStatus,
        providerStatus,
        isLoading,
        setPrompt,
        setNegativePrompt,
        handleSubmit,
        reset,
    } = useImageGeneration()

    return (
        <AppErrorBoundary>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">
                    AI Image Generator
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
                    <div className="lg:col-span-1">
                        <ImageGeneratorForm
                            prompt={prompt}
                            setPrompt={setPrompt}
                            negativePrompt={negativePrompt}
                            setNegativePrompt={setNegativePrompt}
                            isLoading={isLoading}
                            onSubmit={handleSubmit}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <ImageDisplay
                            generatedImage={generatedImage}
                            isLoading={isLoading}
                            requestStatus={requestStatus}
                            prompt={prompt}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <ProviderStatus providers={providerStatus} />
                    <QueueStatus status={queueStatus} />
                </div>
            </div>
        </AppErrorBoundary>
    )
}
