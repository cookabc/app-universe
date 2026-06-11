'use client'

import { useCallback, useEffect, useState } from 'react'

const CACHE_KEY = 'tool-previews-v1'
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

interface CacheEntry {
    url: string
    timestamp: number
    service: 'microlink' | 'thum' | 'fallback'
}

interface CacheData {
    [toolId: string]: CacheEntry
}

function getCache(): CacheData {
    if (typeof window === 'undefined') return {}
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (!raw) return {}
        const data = JSON.parse(raw) as CacheData
        // Clean expired entries
        const now = Date.now()
        const cleaned: CacheData = {}
        for (const [key, entry] of Object.entries(data)) {
            if (now - entry.timestamp < CACHE_TTL) {
                cleaned[key] = entry
            }
        }
        return cleaned
    } catch {
        return {}
    }
}

function setCache(toolId: string, entry: CacheEntry) {
    if (typeof window === 'undefined') return
    try {
        const cache = getCache()
        cache[toolId] = entry
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    } catch {
        // Storage full or disabled
    }
}

function getMicrolinkUrl(targetUrl: string): string {
    return `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&embed=screenshot.url`
}

function getThumUrl(targetUrl: string): string {
    return `https://image.thum.io/get/width/600/crop/800/${encodeURIComponent(targetUrl)}`
}

interface UseScreenshotOptions {
    toolId: string
    url: string
    enabled?: boolean
}

interface UseScreenshotResult {
    src: string | null
    isLoading: boolean
    error: boolean
    service: 'microlink' | 'thum' | 'fallback' | null
}

export function useScreenshot({ toolId, url, enabled = true }: UseScreenshotOptions): UseScreenshotResult {
    // Always start with loading state to avoid hydration mismatch
    const [state, setState] = useState<UseScreenshotResult>({
        src: null,
        isLoading: enabled,
        error: false,
        service: null,
    })

    const tryLoad = useCallback(async () => {
        if (!enabled) return

        // Check cache after mount (client-only)
        const cache = getCache()
        const cached = cache[toolId]
        if (cached) {
            setState({
                src: cached.url,
                isLoading: false,
                error: false,
                service: cached.service,
            })
            return
        }

        setState((s) => ({ ...s, isLoading: true, error: false }))

        // Try Microlink first
        const microlinkUrl = getMicrolinkUrl(url)
        try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 8000)

            const response = await fetch(microlinkUrl, {
                signal: controller.signal,
                cache: 'no-store',
            })
            clearTimeout(timeout)

            if (response.ok) {
                const blob = await response.blob()
                if (blob.type.startsWith('image/')) {
                    const objectUrl = URL.createObjectURL(blob)
                    setCache(toolId, { url: microlinkUrl, timestamp: Date.now(), service: 'microlink' })
                    setState({
                        src: objectUrl,
                        isLoading: false,
                        error: false,
                        service: 'microlink',
                    })
                    return
                }
            }
        } catch {
            // Microlink failed, try Thum.io
        }

        // Try Thum.io as fallback
        const thumUrl = getThumUrl(url)
        try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 8000)

            const response = await fetch(thumUrl, {
                signal: controller.signal,
                cache: 'no-store',
            })
            clearTimeout(timeout)

            if (response.ok) {
                const blob = await response.blob()
                if (blob.type.startsWith('image/')) {
                    const objectUrl = URL.createObjectURL(blob)
                    setCache(toolId, { url: thumUrl, timestamp: Date.now(), service: 'thum' })
                    setState({
                        src: objectUrl,
                        isLoading: false,
                        error: false,
                        service: 'thum',
                    })
                    return
                }
            }
        } catch {
            // Thum.io also failed
        }

        // Both failed - will show fallback in UI
        setState({
            src: null,
            isLoading: false,
            error: true,
            service: 'fallback',
        })
    }, [toolId, url, enabled])

    useEffect(() => {
        tryLoad()
    }, [tryLoad])

    return state
}
