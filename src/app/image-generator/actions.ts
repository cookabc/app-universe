'use server'

import { apiDispatcher } from './lib/api-dispatcher'
import { queueManager } from './lib/queue-manager'
import type { GenerationRequest } from './types'

async function processImageRequest(request: GenerationRequest) {
    const { success } = await apiDispatcher.dispatch()
    queueManager.complete(request.id, success)
    // In a real app, you would store the generated image URL here.
}

export async function generateImageAction(prompt: string, negativePrompt: string) {
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
    return queueManager.getStatus()
}

export async function getProviderStatusAction() {
    return apiDispatcher.getProviderStatus()
}

export async function getGenerationStatusAction(requestId: string): Promise<GenerationRequest | { error: string }> {
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
