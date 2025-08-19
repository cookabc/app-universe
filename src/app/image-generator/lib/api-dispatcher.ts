import { ApiProvider } from '../types'

class ApiDispatcher {
    private providers: ApiProvider[]
    private currentIndex = 0

    constructor() {
        this.providers = [
            { name: 'Provider A (Fast)', status: 'online', latency: 2000 },
            { name: 'Provider B (Average)', status: 'online', latency: 5000 },
            { name: 'Provider C (Slow)', status: 'online', latency: 10000 },
            { name: 'Provider D (Unstable)', status: 'degraded', latency: 3000 },
        ]
    }

    async dispatch(): Promise<{ provider: ApiProvider; success: boolean }> {
        const provider = this.getnextProvider()

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, provider.latency))

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
