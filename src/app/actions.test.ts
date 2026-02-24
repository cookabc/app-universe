import { describe, expect, test, mock } from "bun:test";

// Mock environment variables
process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";

// Mock dependencies
mock.module("@/hooks/useAuth", () => ({
    getUserWithAuth: async () => ({ id: "test-user-id" })
}));

mock.module("ai", () => ({
    streamText: async () => {
        return {
            textStream: (async function* () {
                yield "Hello ";
                yield "world";
            })()
        };
    },
    generateObject: async () => ({ object: [] }),
    generateText: async () => ({ text: "generated" })
}));

mock.module("@ai-sdk/openai", () => ({
    openai: (model: string) => ({ model })
}));

mock.module("@ai-sdk/rsc", () => ({
    createStreamableValue: (initial: string) => {
        let current = initial;
        return {
            value: {
                streamValue: current
            },
            update: (delta: string) => { current += delta; },
            done: () => {},
            error: (e: any) => {}
        };
    }
}));

mock.module("@/db", () => ({
    db: {
        query: {
            artifacts: { findMany: async () => [] },
            prompts: { findMany: async () => [], findFirst: async () => null },
            promptVersions: { findFirst: async () => null }
        },
        insert: () => ({ values: () => Promise.resolve() })
    }
}));

// Mock kuroshiro
mock.module("kuroshiro", () => {
    return {
        default: class Kuroshiro {
            init() { return Promise.resolve(); }
            convert() { return Promise.resolve("converted"); }
        }
    };
});

mock.module("kuroshiro-analyzer-kuromoji", () => {
    return {
        default: class KuromojiAnalyzer {}
    };
});

mock.module("next/cache", () => ({
    revalidateTag: () => {},
    unstable_cache: (fn: any) => fn
}));

// Need to import after mocks
import type { Message } from "./actions";

describe("continueConversation", () => {
    test("should return streamed response structure", async () => {
        const { continueConversation } = await import("./actions");
        const history: Message[] = [{ role: "user", content: "Hello" }];

        const result = await continueConversation(history);

        expect(result).toBeDefined();
        expect(result.messages).toEqual(history);
        expect(result.newMessage).toBeDefined();
        // Check if newMessage has the structure we mocked
        // Note: createStreamableValue usually returns a more complex object,
        // but our mock returns { value: { streamValue: ... } }
        expect(result.newMessage).toHaveProperty("streamValue");
    });

    test("should throw ValidationError for invalid history", async () => {
        const { continueConversation } = await import("./actions");
        // We expect it to throw because we pass invalid history
        // @ts-ignore
        const promise = continueConversation("invalid");
        expect(promise).rejects.toThrow();
    });
});
