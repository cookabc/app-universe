import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { usePolling } from '@/hooks/usePolling'
import {
    generateImageAction,
    getGenerationStatusAction,
    getProviderStatusAction,
    getQueueStatusAction,
} from '../actions'
import type { ApiProvider, GenerationRequest, QueueState } from '../types'

interface UseImageGenerationProps {
    initialPrompt?: string
    initialNegativePrompt?: string
}

export function useImageGeneration({
    initialPrompt = 'A beautiful landscape painting',
    initialNegativePrompt = 'ugly, deformed, noisy',
}: UseImageGenerationProps = {}) {
    const [prompt, setPrompt] = useState(initialPrompt)
    const [negativePrompt, setNegativePrompt] = useState(initialNegativePrompt)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [requestId, setRequestId] = useState<string | null>(null)
    const [requestStatus, setRequestStatus] = useState<GenerationRequest | null>(null)
    const [queueStatus, setQueueStatus] = useState<QueueState | null>(null)
    const [providerStatus, setProviderStatus] = useState<ApiProvider[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    // Poll for queue and provider status
    const _queuePolling = usePolling({
        fn: async () => {
            const [queueData, providerData] = await Promise.all([getQueueStatusAction(), getProviderStatusAction()])
            return { queue: queueData, providers: providerData }
        },
        interval: 5000,
        enabled: true,
        onSuccess: (data) => {
            setQueueStatus(data.queue)
            setProviderStatus(data.providers)
        },
        onError: (error) => {
            console.error('Error fetching status:', error)
            toast({
                title: 'Error',
                description: 'Failed to fetch status',
                variant: 'destructive',
            })
        },
    })

    // Poll for generation status when requestId is set
    const _generationPolling = usePolling({
        fn: () => getGenerationStatusAction(requestId!),
        interval: 2000,
        enabled: !!requestId,
        immediate: true,
        onSuccess: (status) => {
            if ('error' in status) {
                toast({
                    title: 'Error',
                    description: status.error,
                    variant: 'destructive',
                })
                setRequestId(null)
                setIsLoading(false)
                return
            }

            setRequestStatus(status)

            if (status.status === 'completed') {
                setGeneratedImage((status as any).imageUrl)
                setRequestId(null)
                setIsLoading(false)
                toast({
                    title: 'Image generated!',
                    description: 'Your image is ready.',
                })
            } else if (status.status === 'failed') {
                toast({
                    title: 'Generation failed',
                    description: 'Please try again.',
                    variant: 'destructive',
                })
                setRequestId(null)
                setIsLoading(false)
            }
        },
        onError: (error) => {
            console.error('Error polling generation status:', error)
            toast({
                title: 'Polling Error',
                description: 'Failed to check generation status',
                variant: 'destructive',
            })
            setRequestId(null)
            setIsLoading(false)
        },
    })

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Please enter a prompt',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        setGeneratedImage(null)
        setRequestStatus(null)

        toast({
            title: 'Image generation started',
            description: 'Your request has been added to the queue.',
        })

        try {
            const result = await generateImageAction(prompt, negativePrompt)

            if (result.success && result.requestId) {
                setRequestId(result.requestId)
            } else {
                throw new Error('Could not start generation')
            }
        } catch (error) {
            console.error('Error starting generation:', error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Could not start generation',
                variant: 'destructive',
            })
            setIsLoading(false)
        }
    }

    const reset = () => {
        setPrompt(initialPrompt)
        setNegativePrompt(initialNegativePrompt)
        setGeneratedImage(null)
        setRequestId(null)
        setRequestStatus(null)
        setIsLoading(false)
    }

    return {
        // State
        prompt,
        negativePrompt,
        generatedImage,
        requestStatus,
        queueStatus,
        providerStatus,
        isLoading,
        requestId,

        // Actions
        setPrompt,
        setNegativePrompt,
        handleSubmit,
        reset,
    }
}
