import { describe, test, expect, spyOn, beforeEach } from 'bun:test'
import { ApiDispatcher } from './api-dispatcher'
import type { ApiProvider } from '../types'

describe('ApiDispatcher', () => {
    let mockProviders: ApiProvider[]

    beforeEach(() => {
        mockProviders = [
            {
                id: '1',
                name: 'Test Provider A',
                status: 'online',
                capacity: 100,
                currentLoad: 20,
                responseTime: 0, // 0ms for fast tests
            },
            {
                id: '2',
                name: 'Test Provider B',
                status: 'online',
                capacity: 100,
                currentLoad: 50,
                responseTime: 0,
            },
        ]
    })

    test('should initialize with default providers if none are passed', () => {
        const dispatcher = new ApiDispatcher()
        const providers = dispatcher.getProviderStatus()
        expect(providers.length).toBe(4) // Default has 4 providers
        expect(providers[0].name).toBe('Provider A (Fast)')
    })

    test('should initialize with custom providers', () => {
        const dispatcher = new ApiDispatcher(mockProviders)
        const providers = dispatcher.getProviderStatus()
        expect(providers.length).toBe(2)
        expect(providers[0].name).toBe('Test Provider A')
        expect(providers[1].name).toBe('Test Provider B')
    })

    test('should round-robin through providers', async () => {
        const dispatcher = new ApiDispatcher(mockProviders)

        // First call -> Provider A
        const result1 = await dispatcher.dispatch()
        expect(result1.provider.id).toBe('1')

        // Second call -> Provider B
        const result2 = await dispatcher.dispatch()
        expect(result2.provider.id).toBe('2')

        // Third call -> Provider A (back to start)
        const result3 = await dispatcher.dispatch()
        expect(result3.provider.id).toBe('1')
    })

    test('should handle success based on random chance (online provider)', async () => {
        const dispatcher = new ApiDispatcher([mockProviders[0]]) // Only Provider A (online)

        // Mock Math.random to return 0.2 ( > 0.1, so success)
        const randomSpy = spyOn(Math, 'random')
        randomSpy.mockReturnValue(0.2)

        const resultSuccess = await dispatcher.dispatch()
        expect(resultSuccess.success).toBe(true)

        // Mock Math.random to return 0.05 ( <= 0.1, so failure)
        randomSpy.mockReturnValue(0.05)

        const resultFailure = await dispatcher.dispatch()
        expect(resultFailure.success).toBe(false)

        randomSpy.mockRestore()
    })

    test('should handle success based on random chance (maintenance provider)', async () => {
        const maintenanceProvider: ApiProvider = {
            ...mockProviders[0],
            status: 'maintenance',
        }
        const dispatcher = new ApiDispatcher([maintenanceProvider])

        // Mock Math.random to return 0.6 ( > 0.5, so success)
        const randomSpy = spyOn(Math, 'random')
        randomSpy.mockReturnValue(0.6)

        const resultSuccess = await dispatcher.dispatch()
        expect(resultSuccess.success).toBe(true)

        // Mock Math.random to return 0.4 ( <= 0.5, so failure)
        randomSpy.mockReturnValue(0.4)

        const resultFailure = await dispatcher.dispatch()
        expect(resultFailure.success).toBe(false)

        randomSpy.mockRestore()
    })

    test('should throw error if no providers are available', async () => {
        const dispatcher = new ApiDispatcher([])
        // We expect the promise to be rejected with the specific error message
        expect(dispatcher.dispatch()).rejects.toThrow('No provider found')
    })
})
