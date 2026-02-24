import { describe, expect, test, setSystemTime, afterAll } from "bun:test";
import { calculateCountdown } from "./dateUtils";

describe("calculateCountdown", () => {
    // We'll set a fixed "now" time for all tests: 2024-01-10 12:00:00
    const NOW = new Date("2024-01-10T12:00:00Z");
    setSystemTime(NOW);

    afterAll(() => {
        // Reset system time after all tests in this file
        setSystemTime();
    });

    test("should handle future dates in days (> 24h)", () => {
        const target = new Date("2024-01-12T12:00:00Z"); // 2 days later
        const result = calculateCountdown(target);
        expect(result).toEqual({
            diffValue: 2,
            diffUnit: "days",
            label: "days to go",
        });
    });

    test("should handle future dates in hours (< 24h)", () => {
        const target = new Date("2024-01-10T17:00:00Z"); // 5 hours later
        const result = calculateCountdown(target);
        expect(result).toEqual({
            diffValue: 5,
            diffUnit: "hours",
            label: "hours to go",
        });
    });

    test("should handle past dates in days (> 24h)", () => {
        const target = new Date("2024-01-08T12:00:00Z"); // 2 days ago
        const result = calculateCountdown(target);
        expect(result).toEqual({
            diffValue: 2,
            diffUnit: "days",
            label: "days ago",
        });
    });

    test("should handle past dates in hours (< 24h)", () => {
        const target = new Date("2024-01-10T07:00:00Z"); // 5 hours ago
        const result = calculateCountdown(target);
        expect(result).toEqual({
            diffValue: 5,
            diffUnit: "hours",
            label: "hours ago",
        });
    });

    test("should handle date exactly now", () => {
        const target = new Date(NOW.getTime());
        const result = calculateCountdown(target);
        expect(result).toEqual({
            diffValue: 0,
            diffUnit: "hours",
            label: "hours to go",
        });
    });

    test("should handle future dates less than an hour away", () => {
        const target = new Date(NOW.getTime() + 30 * 60 * 1000); // 30 mins later
        const result = calculateCountdown(target);
        expect(result).toEqual({
            diffValue: 0,
            diffUnit: "hours",
            label: "hours to go",
        });
    });

    test("should handle past dates less than an hour ago", () => {
        const target = new Date(NOW.getTime() - 30 * 60 * 1000); // 30 mins ago
        const result = calculateCountdown(target);
        expect(result).toEqual({
            diffValue: 0,
            diffUnit: "hours",
            label: "hours ago",
        });
    });

    test("should handle the edge case of exactly 24 hours in the future", () => {
        const target = new Date(NOW.getTime() + 24 * 60 * 60 * 1000);
        const result = calculateCountdown(target);
        expect(result).toEqual({
            diffValue: 1,
            diffUnit: "days",
            label: "days to go",
        });
    });

    test("should handle the edge case of 23 hours and 59 minutes in the future", () => {
        const target = new Date(NOW.getTime() + (23 * 60 + 59) * 60 * 1000);
        const result = calculateCountdown(target);
        expect(result).toEqual({
            diffValue: 23,
            diffUnit: "hours",
            label: "hours to go",
        });
    });
});
