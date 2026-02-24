'use client'

import { usePerformanceMetrics } from '@/hooks/use-performance-metrics'
import { getPerformanceScore, type PerformanceMetrics } from './performance-utils'
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
    const metrics = usePerformanceMetrics({ onMetrics, enableConsoleLogging })

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

export { usePerformanceMetrics, getPerformanceScore }
