'use client'

import { usePerformanceMetrics } from '@/hooks/use-performance-metrics'
import type { PerformanceMetrics } from '@/components/optimized/performance-utils'

export function PerformanceMonitor({
    onMetrics,
    enableConsoleLogging = false,
}: {
    onMetrics?: (metrics: PerformanceMetrics) => void
    enableConsoleLogging?: boolean
}) {
    const metrics = usePerformanceMetrics({
        ...(onMetrics ? { onMetrics } : {}),
        enableConsoleLogging
    })

    // Development-only performance display
    if (process.env.NODE_ENV === 'development' && enableConsoleLogging) {
        return (
            <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded text-xs font-mono z-[9999] pointer-events-none">
                <div className="font-bold mb-2">Performance Metrics</div>
                <div className="space-y-1">
                    <div>FCP: {metrics.fcp?.toFixed(2) ?? '-'}ms</div>
                    <div>LCP: {metrics.lcp?.toFixed(2) ?? '-'}ms</div>
                    <div>CLS: {metrics.cls?.toFixed(4) ?? '-'}</div>
                    <div>FID: {metrics.fid?.toFixed(2) ?? '-'}ms</div>
                    <div>TTFB: {metrics.ttfb?.toFixed(2) ?? '-'}ms</div>
                </div>
            </div>
        )
    }

    return null
}
