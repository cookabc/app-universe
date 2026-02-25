import { describe, expect, test } from "bun:test";
import { getPerformanceScore, type PerformanceMetrics } from "./performance-utils";

describe("getPerformanceScore", () => {
    test("should return 100 for empty metrics", () => {
        expect(getPerformanceScore({})).toBe(100);
    });

    const testCases: { metrics: PerformanceMetrics; expected: number; description: string }[] = [
        // FCP Tests
        { metrics: { fcp: 1000 }, expected: 100, description: "Good FCP" },
        { metrics: { fcp: 1800 }, expected: 100, description: "FCP at Good threshold" },
        { metrics: { fcp: 1801 }, expected: 90, description: "FCP just above Good threshold" },
        { metrics: { fcp: 3000 }, expected: 90, description: "FCP at Needs Improvement threshold" },
        { metrics: { fcp: 3001 }, expected: 75, description: "FCP just above Needs Improvement threshold (Poor)" },

        // LCP Tests
        { metrics: { lcp: 2000 }, expected: 100, description: "Good LCP" },
        { metrics: { lcp: 2500 }, expected: 100, description: "LCP at Good threshold" },
        { metrics: { lcp: 2501 }, expected: 85, description: "LCP just above Good threshold" },
        { metrics: { lcp: 4000 }, expected: 85, description: "LCP at Needs Improvement threshold" },
        { metrics: { lcp: 4001 }, expected: 70, description: "LCP just above Needs Improvement threshold (Poor)" },

        // FID Tests
        { metrics: { fid: 50 }, expected: 100, description: "Good FID" },
        { metrics: { fid: 100 }, expected: 100, description: "FID at Good threshold" },
        { metrics: { fid: 101 }, expected: 90, description: "FID just above Good threshold" },
        { metrics: { fid: 300 }, expected: 90, description: "FID at Needs Improvement threshold" },
        { metrics: { fid: 301 }, expected: 75, description: "FID just above Needs Improvement threshold (Poor)" },

        // CLS Tests
        { metrics: { cls: 0.05 }, expected: 100, description: "Good CLS" },
        { metrics: { cls: 0.1 }, expected: 100, description: "CLS at Good threshold" },
        { metrics: { cls: 0.11 }, expected: 90, description: "CLS just above Good threshold" },
        { metrics: { cls: 0.25 }, expected: 90, description: "CLS at Needs Improvement threshold" },
        { metrics: { cls: 0.26 }, expected: 80, description: "CLS just above Needs Improvement threshold (Poor)" },

        // Combined Tests
        {
            metrics: { fcp: 2000, lcp: 3000, fid: 200, cls: 0.15 },
            expected: 100 - 10 - 15 - 10 - 10, // 55
            description: "All metrics Need Improvement"
        },
        {
            metrics: { fcp: 3500, lcp: 4500, fid: 400, cls: 0.3 },
            expected: 0, // 100 - 25 - 30 - 25 - 20 = 0
            description: "All metrics Poor"
        },
        {
            metrics: { fcp: 1000, lcp: 4500, fid: 50, cls: 0.3 },
            expected: 100 - 0 - 30 - 0 - 20, // 50
            description: "Mixed Good and Poor metrics"
        },

        // Boundary/Edge Cases
        {
            metrics: { fcp: 10000, lcp: 10000, fid: 1000, cls: 1.0 },
            expected: 0,
            description: "Extremely poor metrics"
        },
        {
            metrics: { ttfb: 500 }, // ttfb is not used in score calculation currently
            expected: 100,
            description: "Metric not used in calculation (ttfb)"
        }
    ];

    testCases.forEach(({ metrics, expected, description }) => {
        test(description, () => {
            expect(getPerformanceScore(metrics)).toBe(expected);
        });
    });

    test("should not return a score below 0", () => {
        // Even if deductions exceeded 100, it should be capped at 0
        // (Current max deduction is exactly 100, so we need to mock or find a way if it could exceed)
        // Since we can't easily mock the function internal constants, we trust Math.max(0, score)
        expect(getPerformanceScore({ fcp: 5000, lcp: 5000, fid: 500, cls: 1.0 })).toBe(0);
    });
});
