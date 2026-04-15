import type { GenerationRequest } from '../types'

class QueueManager {
    private queue: GenerationRequest[] = []
    private processing: GenerationRequest[] = []
    private maxWorkers: number

    constructor(maxWorkers = 4) {
        this.maxWorkers = maxWorkers
    }

    add(prompt: string, negativePrompt?: string): GenerationRequest {
        const id = `req-${crypto.randomUUID()}`
        const request: GenerationRequest = {
            id,
            prompt,
            status: 'queued',
        }
        if (negativePrompt) {
            request.negativePrompt = negativePrompt
        }
        this.queue.push(request)
        this.processQueue()
        return request
    }

    getNext(): GenerationRequest | null {
        if (this.processing.length >= this.maxWorkers) {
            return null
        }
        const request = this.queue.shift()
        if (request) {
            request.status = 'processing'
            this.processing.push(request)
            return request
        }
        return null
    }

    complete(requestId: string, success: boolean) {
        const index = this.processing.findIndex((req) => req.id === requestId)
        if (index > -1) {
            const request = this.processing[index]
            if (request) {
                request.status = success ? 'completed' : 'failed'
            }
            this.processing.splice(index, 1)
        }
        this.processQueue()
    }

    private processQueue() {
        // This method can be expanded to automatically process the queue
        // For now, it's manually triggered
    }

    getStatus() {
        return {
            queue: this.queue,
            processing: this.processing,
            activeWorkers: this.processing.length,
            maxWorkers: this.maxWorkers,
        }
    }

    getRequest(requestId: string): GenerationRequest | undefined {
        return this.queue.find((req) => req.id === requestId) || this.processing.find((req) => req.id === requestId)
    }
}

export const queueManager = new QueueManager()
