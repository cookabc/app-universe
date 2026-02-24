'use client'

import { useEffect, useState } from 'react'
import { logger } from '@/lib/logger'
import { type PerformanceMetrics, getPerformanceScore } from './performance-utils'

export { getPerformanceScore }
export type { PerformanceMetrics }

interface LayoutShift extends PerformanceEntry {
    entryType: 'layout-shift'
    value: number
    hadRecentInput: boolean
    lastInputTime: number
    sources: Array<unknown>
}

// Performance monitoring component for React 19 and Next.js 15
export function PerformanceMonitor({
    onMetrics,
    enableConsoleLogging = false,
}: {
    onMetrics?: (metrics: PerformanceMetrics) => void
    enableConsoleLogging?: boolean
}) {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({})

    useEffect(() => {
        // Web Vitals monitoring
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const newMetrics: PerformanceMetrics = {}

                switch (entry.entryType) {
                    case 'paint':
                        if (entry.name === 'first-contentful-paint') {
                            newMetrics.fcp = entry.startTime
                        }
                        break
                    case 'largest-contentful-paint':
                        newMetrics.lcp = entry.startTime
                        break
                    case 'first-input':
                        newMetrics.fid = (entry as PerformanceEventTiming).processingStart - entry.startTime
                        break
                    case 'layout-shift':
                        if (!(entry as LayoutShift).hadRecentInput) {
                            newMetrics.cls = (metrics.cls || 0) + (entry as LayoutShift).value
                        }
                        break
                    case 'navigation': {
                        const navEntry = entry as PerformanceNavigationTiming
                        newMetrics.ttfb = navEntry.responseStart - navEntry.requestStart
                        break
                    }
                }

                if (Object.keys(newMetrics).length > 0) {
                    setMetrics((prev) => {
                        const updated = { ...prev, ...newMetrics }
                        onMetrics?.(updated)

                        if (enableConsoleLogging) {
                            logger.debug('Performance Metrics:', updated)
                        }

                        return updated
                    })
                }
            }
        })

        // Observe different performance entry types
        try {
            observer.observe({
                entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'],
            })
        } catch (error) {
            logger.warn('Performance Observer not supported:', error)
        }

        return () => observer.disconnect()
    }, [onMetrics, enableConsoleLogging, metrics.cls])

    // Development-only performance display
    if (process.env.NODE_ENV === 'development' && enableConsoleLogging) {
        return (
            <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
                <div className="space-y-1">
                    <div>FCP: {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'}</div>
                    <div>LCP: {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}</div>
                    <div>FID: {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}</div>
                    <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}</div>
                    <div>TTFB: {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}</div>
                </div>
            </div>
        )
    }

    return null
}

// Hook for performance metrics
export function usePerformanceMetrics() {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({})

    useEffect(() => {
        const observer = new PerformanceObserver((list) => {
            const newMetrics: PerformanceMetrics = {}

            for (const entry of list.getEntries()) {
                switch (entry.entryType) {
                    case 'paint':
                        if (entry.name === 'first-contentful-paint') {
                            newMetrics.fcp = entry.startTime
                        }
                        break
                    case 'largest-contentful-paint':
                        newMetrics.lcp = entry.startTime
                        break
                    case 'first-input':
                        newMetrics.fid = (entry as PerformanceEventTiming).processingStart - entry.startTime
                        break
                    case 'layout-shift':
                        if (!(entry as LayoutShift).hadRecentInput) {
                            newMetrics.cls = (metrics.cls || 0) + (entry as LayoutShift).value
                        }
                        break
                }
            }

            if (Object.keys(newMetrics).length > 0) {
                setMetrics((prev) => ({ ...prev, ...newMetrics }))
            }
        })

        try {
            observer.observe({
                entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'],
            })
        } catch (error) {
            logger.warn('Performance Observer not supported:', error)
        }

        return () => observer.disconnect()
    }, [metrics.cls])

    return metrics
}

