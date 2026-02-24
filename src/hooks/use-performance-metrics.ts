import { useEffect, useState } from 'react'
import type { LayoutShift, PerformanceMetrics } from '@/components/optimized/performance-utils'
import { logger } from '@/lib/logger'

interface UsePerformanceMetricsOptions {
    onMetrics?: (metrics: PerformanceMetrics) => void
    enableConsoleLogging?: boolean
}

export function usePerformanceMetrics({ onMetrics, enableConsoleLogging = false }: UsePerformanceMetricsOptions = {}) {
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
                    case 'navigation': {
                        const navEntry = entry as PerformanceNavigationTiming
                        newMetrics.ttfb = navEntry.responseStart - navEntry.requestStart
                        break
                    }
                }
            }

            if (Object.keys(newMetrics).length > 0) {
                setMetrics((prev: PerformanceMetrics) => {
                    const updated = { ...prev, ...newMetrics }
                    onMetrics?.(updated)

                    if (enableConsoleLogging) {
                        logger.debug('Performance Metrics:', updated)
                    }

                    return updated
                })
            }
        })

        try {
            observer.observe({
                entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'],
            })
        } catch (error) {
            logger.warn('Performance Observer not supported:', error)
        }

        return () => observer.disconnect()
    }, [metrics.cls, onMetrics, enableConsoleLogging])

    return metrics
}
