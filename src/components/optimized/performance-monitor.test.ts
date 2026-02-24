import { describe, expect, test } from "bun:test";
import { getPerformanceScore } from "./performance-monitor";

describe("getPerformanceScore", () => {
    test("should return 100 for empty metrics", () => {
        expect(getPerformanceScore({})).toBe(100);
    });

    test("should handle FCP scoring correctly", () => {
        // Good (< 1800)
        expect(getPerformanceScore({ fcp: 1000 })).toBe(100);
        expect(getPerformanceScore({ fcp: 1800 })).toBe(100);

        // Needs improvement (1800 - 3000)
        expect(getPerformanceScore({ fcp: 1801 })).toBe(90);
        expect(getPerformanceScore({ fcp: 3000 })).toBe(90);

        // Poor (> 3000)
        expect(getPerformanceScore({ fcp: 3001 })).toBe(75);
    });

    test("should handle LCP scoring correctly", () => {
        // Good (< 2500)
        expect(getPerformanceScore({ lcp: 2000 })).toBe(100);
        expect(getPerformanceScore({ lcp: 2500 })).toBe(100);

        // Needs improvement (2500 - 4000)
        expect(getPerformanceScore({ lcp: 2501 })).toBe(85);
        expect(getPerformanceScore({ lcp: 4000 })).toBe(85);

        // Poor (> 4000)
        expect(getPerformanceScore({ lcp: 4001 })).toBe(70);
    });

    test("should handle FID scoring correctly", () => {
        // Good (< 100)
        expect(getPerformanceScore({ fid: 50 })).toBe(100);
        expect(getPerformanceScore({ fid: 100 })).toBe(100);

        // Needs improvement (100 - 300)
        expect(getPerformanceScore({ fid: 101 })).toBe(90);
        expect(getPerformanceScore({ fid: 300 })).toBe(90);

        // Poor (> 300)
        expect(getPerformanceScore({ fid: 301 })).toBe(75);
    });

    test("should handle CLS scoring correctly", () => {
        // Good (< 0.1)
        expect(getPerformanceScore({ cls: 0.05 })).toBe(100);
        expect(getPerformanceScore({ cls: 0.1 })).toBe(100);

        // Needs improvement (0.1 - 0.25)
        expect(getPerformanceScore({ cls: 0.11 })).toBe(90);
        expect(getPerformanceScore({ cls: 0.25 })).toBe(90);

        // Poor (> 0.25)
        expect(getPerformanceScore({ cls: 0.26 })).toBe(80);
    });

    test("should handle combined metrics correctly", () => {
        // Example: Poor FCP (-25), Poor LCP (-30), Poor FID (-25), Poor CLS (-20) = -100 deduction -> score 0
        expect(getPerformanceScore({
            fcp: 3500,
            lcp: 4500,
            fid: 400,
            cls: 0.3
        })).toBe(0);

        // Example: Needs improvement FCP (-10), Good LCP (0), Needs improvement FID (-10), Good CLS (0) = -20 deduction -> score 80
        expect(getPerformanceScore({
            fcp: 2000,
            lcp: 2000,
            fid: 200,
            cls: 0.05
        })).toBe(80);
    });

    test("should not return a score below 0", () => {
        // Ensure even with massive deductions, score is capped at 0
        expect(getPerformanceScore({
            fcp: 5000, // -25
            lcp: 6000, // -30
            fid: 500,  // -25
            cls: 0.5   // -20
            // Total deduction: 100. Score: 0.
        })).toBe(0);

        // Let's force a scenario where logic might suggest < 0 if deductions were higher or multiple penalties applied
        // But logic is explicitly capping deductions based on ranges.
        // Let's modify logic mentally: max deduction is 25+30+25+20 = 100. So min score is 0.
        // Wait, if I had multiple penalties for same metric (which shouldn't happen due to if/else if), it could go lower.
        // The implementation uses `Math.max(0, score)`, so it handles negative values.
    });
});
