import { beforeAll, describe, expect, it, mock } from 'bun:test'
import { Webhook } from 'svix'

// Mock environment variables
process.env.CLERK_WEBHOOK_SECRET = 'whsec_dGVzdHNZWNyZXQ=' // Valid base64 secret

// Mock dependencies BEFORE importing the module under test
mock.module('next/headers', () => {
    return {
        headers: async () => {
            // Return a Map-like object or Headers object
            return new Headers(global.mockHeaders || {})
        },
    }
})

mock.module('@/db', () => {
    return {
        db: {
            insert: () => ({ values: () => Promise.resolve() }),
            update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
        },
    }
})

mock.module('@/db/schema', () => {
    return {
        users: {},
    }
})

// Import the handler
// Using dynamic import to ensure mocks are applied
const { POST } = await import('./route')

describe('Clerk Webhook Handler', () => {
    it('should verify signature correctly with raw body', async () => {
        const secret = process.env.CLERK_WEBHOOK_SECRET
        const wh = new Webhook(secret!)

        // Payload with significant whitespace
        const payloadObj = { type: 'test.event', data: { test: true }, message: 'Hello World' }
        // Original payload has spaces
        const payloadString = JSON.stringify(payloadObj, null, 2)

        // Generate valid signature for this exact string
        const timestamp = new Date()
        const msgId = 'msg_' + Math.random().toString(36).substring(7)
        const signature = wh.sign(msgId, timestamp, payloadString)

        // Set up headers for the mocked headers() function
        global.mockHeaders = {
            'svix-id': msgId,
            'svix-timestamp': Math.floor(timestamp.getTime() / 1000).toString(),
            'svix-signature': signature,
            'content-type': 'application/json',
        }

        // Create a Request with the original payload string
        const req = new Request('http://localhost/api/webhooks/clerk', {
            method: 'POST',
            body: payloadString,
            headers: global.mockHeaders,
        })

        // Call the handler
        const res = await POST(req)

        // Expect success (200) because handler now uses raw body
        expect(res.status).toBe(200)
    })
})

// Helper for type
declare global {
    var mockHeaders: Record<string, string>
}
