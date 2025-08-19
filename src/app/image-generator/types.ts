export interface GenerationRequest {
    id: string
    prompt: string
    negativePrompt?: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
}

export interface ApiProvider {
    name: string
    status: 'online' | 'degraded' | 'offline'
    latency: number
}

export interface QueueState {
    queue: GenerationRequest[]
    processing: GenerationRequest[]
    activeWorkers: number
    maxWorkers: number
}
