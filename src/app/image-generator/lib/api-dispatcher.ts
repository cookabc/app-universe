import { ApiProvider } from '../types'

class ApiDispatcher {
    private providers: ApiProvider[]
    private currentIndex = 0

    constructor() {
        this.providers = [
            { id: '1', name: 'Provider A (Fast)', status: 'online', capacity: 100, currentLoad: 20, responseTime: 2000 },
            { id: '2', name: 'Provider B (Average)', status: 'online', capacity: 100, currentLoad: 50, responseTime: 5000 },
            { id: '3', name: 'Provider C (Slow)', status: 'online', capacity: 100, currentLoad: 80, responseTime: 10000 },
            { id: '4', name: 'Provider D (Unstable)', status: 'maintenance', capacity: 100, currentLoad: 90, responseTime: 3000 },
        ]
    }

    async dispatch(): Promise<{ provider: ApiProvider; success: boolean }> {
        const provider = this.getnextProvider()

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, provider.responseTime))

        // Simulate success rate
        const success = provider.status === 'online' ? Math.random() > 0.1 : Math.random() > 0.5

        return { provider, success }
    }

    private getnextProvider(): ApiProvider {
        const provider = this.providers[this.currentIndex]
        this.currentIndex = (this.currentIndex + 1) % this.providers.length
        if (!provider) {
            throw new Error('No provider found')
        }
        return provider
    }

    getProviderStatus(): ApiProvider[] {
        // In a real app, you might ping providers to get real-time status
        return this.providers
    }
}

export const apiDispatcher = new ApiDispatcher()
