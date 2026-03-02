'use server'

import { apiDispatcher } from './lib/api-dispatcher'
import { queueManager } from './lib/queue-manager'
import type { GenerationRequest } from './types'
import { auth } from '@clerk/nextjs/server'

async function processImageRequest(request: GenerationRequest) {
    const { success } = await apiDispatcher.dispatch()
    queueManager.complete(request.id, success)
    // In a real app, you would store the generated image URL here.
}

export async function generateImageAction(prompt: string, negativePrompt: string) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const request = queueManager.add(prompt, negativePrompt)
    // Process immediately instead of relying on a module-level setInterval,
    // which does not survive serverless cold starts.
    processImageRequest(request).catch(console.error)
    return {
        success: true,
        requestId: request.id,
    }
}

export async function getQueueStatusAction() {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    return queueManager.getStatus()
}

export async function getProviderStatusAction() {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    return apiDispatcher.getProviderStatus()
}

export async function getGenerationStatusAction(requestId: string): Promise<GenerationRequest | { error: string }> {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const request = queueManager.getRequest(requestId)
    if (request) {
        // In a real app, you would return the image URL when completed.
        if (request.status === 'completed') {
            request.imageUrl = 'https://picsum.photos/1024/1024'
        }
        return request
    }
    return { error: 'Request not found' }
}
