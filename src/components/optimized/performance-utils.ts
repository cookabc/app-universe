export interface PerformanceMetrics {
    fcp?: number // First Contentful Paint
    lcp?: number // Largest Contentful Paint
    fid?: number // First Input Delay
    cls?: number // Cumulative Layout Shift
    ttfb?: number // Time to First Byte
}

export interface LayoutShift extends PerformanceEntry {
    value: number
    hadRecentInput: boolean
}

// Performance score calculator
export function getPerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100

    // FCP scoring (good: <1.8s, needs improvement: 1.8s-3s, poor: >3s)
    if (metrics.fcp) {
        if (metrics.fcp > 3000) score -= 25
        else if (metrics.fcp > 1800) score -= 10
    }

    // LCP scoring (good: <2.5s, needs improvement: 2.5s-4s, poor: >4s)
    if (metrics.lcp) {
        if (metrics.lcp > 4000) score -= 30
        else if (metrics.lcp > 2500) score -= 15
    }

    // FID scoring (good: <100ms, needs improvement: 100ms-300ms, poor: >300ms)
    if (metrics.fid) {
        if (metrics.fid > 300) score -= 25
        else if (metrics.fid > 100) score -= 10
    }

    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (metrics.cls) {
        if (metrics.cls > 0.25) score -= 20
        else if (metrics.cls > 0.1) score -= 10
    }

    return Math.max(0, score)
}
