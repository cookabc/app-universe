'use client'

import { useEffect, useState } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { useToast } from '@/hooks/use-toast'
import {
    generateImageAction,
    getGenerationStatusAction,
    getProviderStatusAction,
    getQueueStatusAction,
} from './actions'
import { ImageDisplay } from './components/ImageDisplay'
import { ImageGeneratorForm } from './components/ImageGeneratorForm'
import { ProviderStatus } from './components/ProviderStatus'
import { QueueStatus } from './components/QueueStatus'
import { ApiProvider, GenerationRequest, QueueState } from './types'

export default function ImageGeneratorClient() {
    const [prompt, setPrompt] = useState('A beautiful landscape painting')
    const [negativePrompt, setNegativePrompt] = useState('ugly, deformed, noisy')
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [requestId, setRequestId] = useState<string | null>(null)
    const [requestStatus, setRequestStatus] = useState<GenerationRequest | null>(null)
    const [queueStatus, setQueueStatus] = useState<QueueState | null>(null)
    const [providerStatus, setProviderStatus] = useState<ApiProvider[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        const fetchStatus = async () => {
            setQueueStatus(await getQueueStatusAction())
            setProviderStatus(await getProviderStatusAction())
        }
        fetchStatus()
        const interval = setInterval(fetchStatus, 5000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!requestId) return

        const pollStatus = async () => {
            const status = await getGenerationStatusAction(requestId)
            if ('error' in status) {
                toast({ title: 'Error', description: status.error, variant: 'destructive' })
                setRequestId(null)
                setIsLoading(false)
                return
            }

            setRequestStatus(status)

            if (status.status === 'completed') {
                setGeneratedImage((status as any).imageUrl)
                setRequestId(null)
                setIsLoading(false)
                toast({ title: 'Image generated!', description: 'Your image is ready.' })
            } else if (status.status === 'failed') {
                toast({ title: 'Generation failed', description: 'Please try again.', variant: 'destructive' })
                setRequestId(null)
                setIsLoading(false)
            }
        }

        const interval = setInterval(pollStatus, 2000)
        return () => clearInterval(interval)
    }, [requestId, toast])

    const handleSubmit = async () => {
        setIsLoading(true)
        setGeneratedImage(null)
        setRequestStatus(null)
        toast({
            title: 'Image generation started',
            description: 'Your request has been added to the queue.',
        })
        const result = await generateImageAction(prompt, negativePrompt)
        if (result.success && result.requestId) {
            setRequestId(result.requestId)
        } else {
            toast({ title: 'Error', description: 'Could not start generation.', variant: 'destructive' })
            setIsLoading(false)
        }
    }

    return (
        <AppErrorBoundary>
            <div>
                <h1 className="text-4xl font-bold text-center mb-8">AI Image Generator</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProviderStatus providers={providerStatus} />
                    <QueueStatus status={queueStatus} />
                </div>
            </div>
        </AppErrorBoundary>
    )
}
