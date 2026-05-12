// Centralized type definitions for the application

// Image Generator Types
export interface GenerationRequest {
    id: string
    prompt: string
    negativePrompt?: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    createdAt?: Date
    completedAt?: Date
    imageUrl?: string
    error?: string
}

export interface QueueState {
    queue: GenerationRequest[]
    processing: GenerationRequest[]
    activeWorkers: number
    maxWorkers: number
}

export interface ApiProvider {
    id: string
    name: string
    status: 'online' | 'offline' | 'maintenance'
    capacity: number
    currentLoad: number
    responseTime: number
}
