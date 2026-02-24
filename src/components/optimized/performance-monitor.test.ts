import { describe, expect, test } from 'bun:test'
import { getPerformanceScore } from './performance-utils'

describe('getPerformanceScore', () => {
    test('should return 100 for empty metrics', () => {
        expect(getPerformanceScore({})).toBe(100)
    })

    describe('FCP Scoring', () => {
        test('should return 100 for FCP <= 1800', () => {
            expect(getPerformanceScore({ fcp: 1800 })).toBe(100)
            expect(getPerformanceScore({ fcp: 500 })).toBe(100)
        })

        test('should return 90 for 1800 < FCP <= 3000', () => {
            expect(getPerformanceScore({ fcp: 1801 })).toBe(90)
            expect(getPerformanceScore({ fcp: 3000 })).toBe(90)
            expect(getPerformanceScore({ fcp: 2500 })).toBe(90)
        })

        test('should return 75 for FCP > 3000', () => {
            expect(getPerformanceScore({ fcp: 3001 })).toBe(75)
            expect(getPerformanceScore({ fcp: 5000 })).toBe(75)
        })
    })

    describe('LCP Scoring', () => {
        test('should return 100 for LCP <= 2500', () => {
            expect(getPerformanceScore({ lcp: 2500 })).toBe(100)
            expect(getPerformanceScore({ lcp: 1000 })).toBe(100)
        })

        test('should return 85 for 2500 < LCP <= 4000', () => {
            expect(getPerformanceScore({ lcp: 2501 })).toBe(85)
            expect(getPerformanceScore({ lcp: 4000 })).toBe(85)
            expect(getPerformanceScore({ lcp: 3000 })).toBe(85)
        })

        test('should return 70 for LCP > 4000', () => {
            expect(getPerformanceScore({ lcp: 4001 })).toBe(70)
            expect(getPerformanceScore({ lcp: 6000 })).toBe(70)
        })
    })

    describe('FID Scoring', () => {
        test('should return 100 for FID <= 100', () => {
            expect(getPerformanceScore({ fid: 100 })).toBe(100)
            expect(getPerformanceScore({ fid: 50 })).toBe(100)
        })

        test('should return 90 for 100 < FID <= 300', () => {
            expect(getPerformanceScore({ fid: 101 })).toBe(90)
            expect(getPerformanceScore({ fid: 300 })).toBe(90)
            expect(getPerformanceScore({ fid: 200 })).toBe(90)
        })

        test('should return 75 for FID > 300', () => {
            expect(getPerformanceScore({ fid: 301 })).toBe(75)
            expect(getPerformanceScore({ fid: 500 })).toBe(75)
        })
    })

    describe('CLS Scoring', () => {
        test('should return 100 for CLS <= 0.1', () => {
            expect(getPerformanceScore({ cls: 0.1 })).toBe(100)
            expect(getPerformanceScore({ cls: 0.05 })).toBe(100)
        })

        test('should return 90 for 0.1 < CLS <= 0.25', () => {
            expect(getPerformanceScore({ cls: 0.1001 })).toBe(90)
            expect(getPerformanceScore({ cls: 0.25 })).toBe(90)
            expect(getPerformanceScore({ cls: 0.2 })).toBe(90)
        })

        test('should return 80 for CLS > 0.25', () => {
            expect(getPerformanceScore({ cls: 0.2501 })).toBe(80)
            expect(getPerformanceScore({ cls: 0.5 })).toBe(80)
        })
    })

    test('should handle combined metrics correctly', () => {
        // FCP: 2000 (-10)
        // LCP: 3000 (-15)
        // FID: 200 (-10)
        // CLS: 0.2 (-10)
        // Total deduction: 45
        // Expected score: 55
        expect(
            getPerformanceScore({
                fcp: 2000,
                lcp: 3000,
                fid: 200,
                cls: 0.2,
            }),
        ).toBe(55)
    })

    test('should floor score at 0', () => {
        // FCP: 5000 (-25)
        // LCP: 5000 (-30)
        // FID: 500 (-25)
        // CLS: 0.5 (-20)
        // Total deduction: 100
        // Expected score: 0
        expect(
            getPerformanceScore({
                fcp: 5000,
                lcp: 5000,
                fid: 500,
                cls: 0.5,
            }),
        ).toBe(0)

        // Even more extreme values
        // FCP: 10000 (-25) -> 75
        // LCP: 10000 (-30) -> 45
        // FID: 1000 (-25) -> 20
        // CLS: 1.0 (-20) -> 0
        expect(
            getPerformanceScore({
                fcp: 10000,
                lcp: 10000,
                fid: 1000,
                cls: 1.0,
            }),
        ).toBe(0)
    })
})
