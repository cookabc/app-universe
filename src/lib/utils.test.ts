import { describe, expect, test } from "bun:test";
import { cn } from "./utils";

describe("cn utility", () => {
    test("merges class names correctly", () => {
        expect(cn("foo", "bar")).toBe("foo bar");
    });

    test("handles conditional classes", () => {
        expect(cn("foo", true && "bar", false && "baz")).toBe("foo bar");
    });

    test("handles objects", () => {
        expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });

    test("handles arrays", () => {
        expect(cn(["foo", "bar"])).toBe("foo bar");
    });

    test("handles mixed inputs", () => {
        expect(cn("foo", [ "bar", { baz: true } ], false && "qux")).toBe("foo bar baz");
    });

    test("merges tailwind classes (overrides)", () => {
        expect(cn("p-2", "p-4")).toBe("p-4");
        expect(cn("px-2 py-2", "p-4")).toBe("p-4");
        expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    test("handles empty inputs", () => {
        expect(cn()).toBe("");
        expect(cn(null)).toBe("");
        expect(cn(undefined)).toBe("");
    });
});
