import { GlobalRegistrator } from '@happy-dom/global-registrator'
GlobalRegistrator.register()

import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRealTimeData } from './use-real-time-data'

// Mock WebSocket
class MockWebSocket {
    static instances: MockWebSocket[] = []
    url: string
    onopen: (() => void) | null = null
    onclose: (() => void) | null = null
    onmessage: ((event: { data: string }) => void) | null = null
    onerror: ((error: Error) => void) | null = null
    readyState: number = 0 // CONNECTING

    static CONNECTING = 0
    static OPEN = 1
    static CLOSING = 2
    static CLOSED = 3

    constructor(url: string) {
        this.url = url
        this.readyState = MockWebSocket.CONNECTING
        MockWebSocket.instances.push(this)
    }

    send(data: any) {}

    close() {
        this.readyState = MockWebSocket.CLOSED
        if (this.onclose) this.onclose()
    }

    // Helper to simulate open
    open() {
        this.readyState = MockWebSocket.OPEN
        if (this.onopen) this.onopen()
    }
}

// Override global WebSocket
// @ts-ignore
global.WebSocket = MockWebSocket

describe('useRealTimeData', () => {
    beforeEach(() => {
        MockWebSocket.instances = []
    })

    test('should connect on mount', async () => {
        const { result } = renderHook(() => useRealTimeData('ws://test', { reconnectInterval: 10 }))

        await waitFor(() => expect(MockWebSocket.instances.length).toBe(1))
        expect(result.current.isConnected).toBe(false)

        act(() => {
            const ws = MockWebSocket.instances[0]
            if (ws) ws.open()
        })

        await waitFor(() => expect(result.current.isConnected).toBe(true))
    })

    test('should reconnect on close', async () => {
        const { result } = renderHook(() => useRealTimeData('ws://test', { reconnectInterval: 10, maxReconnectAttempts: 2 }))

        // Initial connect
        await waitFor(() => expect(MockWebSocket.instances.length).toBe(1))
        act(() => {
            const ws = MockWebSocket.instances[0]
            if (ws) ws.open()
        })
        await waitFor(() => expect(result.current.isConnected).toBe(true))

        // Close
        act(() => {
            const ws = MockWebSocket.instances[0]
            if (ws) ws.close()
        })
        await waitFor(() => expect(result.current.isConnected).toBe(false))

        // Wait for reconnect attempt 1
        await waitFor(() => expect(MockWebSocket.instances.length).toBe(2))

        // Simulate open for attempt 1
        act(() => {
            const ws = MockWebSocket.instances[1]
            if (ws) ws.open()
        })
        await waitFor(() => expect(result.current.isConnected).toBe(true))
    })

    test('should not double connect on reconnect', async () => {
        const { result } = renderHook(() => useRealTimeData('ws://test', { reconnectInterval: 20, maxReconnectAttempts: 5 }))

        // Initial
        await waitFor(() => expect(MockWebSocket.instances.length).toBe(1))
        act(() => {
            const ws = MockWebSocket.instances[0]
            if (ws) ws.open()
        })

        // Fail
        act(() => {
            const ws = MockWebSocket.instances[0]
            if (ws) ws.close()
        })

        // Wait for reconnect
        await waitFor(() => expect(MockWebSocket.instances.length).toBe(2))

        // Wait a bit more to see if another one spawns (The bug check)
        await new Promise(r => setTimeout(r, 100))
        expect(MockWebSocket.instances.length).toBe(2)
    })
})
