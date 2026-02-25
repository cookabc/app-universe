import { describe, expect, test, mock, beforeEach, afterEach } from "bun:test";

// Mock environment variables
process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";

// Mock dependencies
// Create a spyable mock for auth
const getUserWithAuthMock = mock(async () => ({ id: "test-user-id" }));

mock.module("@/hooks/useAuth", () => ({
    getUserWithAuth: getUserWithAuthMock
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
    generateObject: async () => ({
        object: {
            questions: [
                { id: 1, text: "Question?", type: "EI", options: ["Yes", "No"] }
            ]
        }
    }),
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

// Mock schema to avoid drizzle-orm import issues
mock.module("@/db/schema", () => ({
    artifacts: {},
    prompts: {},
    promptVersions: {},
}));

// Mock drizzle-orm imports used in actions.ts directly
mock.module("drizzle-orm", () => ({
    eq: () => {}, and: () => {},
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
// We use dynamic import in tests to ensure mocks are applied if not using bun test runner native mocking features correctly
// But here we are using bun test.

describe("continueConversation", () => {
    test("should return streamed response structure", async () => {
        const { continueConversation } = await import("./actions");
        const history: any[] = [{ role: "user", content: "Hello" }]; // cast to any to avoid type import issues

        const result = await continueConversation(history);

        expect(result).toBeDefined();
        expect(result.messages).toEqual(history);
        expect(result.newMessage).toBeDefined();
        expect(result.newMessage).toHaveProperty("streamValue");
    });

    test("should throw ValidationError for invalid history", async () => {
        const { continueConversation } = await import("./actions");
        // @ts-ignore
        const promise = continueConversation("invalid");
        // Wait, continueConversation is wrapped in safeAsync which might catch errors?
        // Let's check implementation. It rethrows if not success.
        // Actually safeAsync returns { success, error } OR throws if specifically handled.
        // In continueConversation:
        // const result = await safeAsync(...)
        // if (!result.success) throw result.error
        // So it throws.
        expect(promise).rejects.toThrow();
    });
});

describe("getQuestions", () => {
    test("should return questions on success", async () => {
        const { getQuestions } = await import("./actions");
        const prompt = "test prompt";
        const result: any = await getQuestions(prompt);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.questions).toBeDefined();
        expect(result.data.questions.length).toBe(1);
        expect(result.data.questions[0].text).toBe("Question?");
    });

    test("should fail if prompt is empty", async () => {
        const { getQuestions } = await import("./actions");
        const result: any = await getQuestions("");

        expect(result.success).toBe(false);
        expect(result.error.code).toBe("VALIDATION_ERROR");
    });
});

describe("Translation Logic", () => {
    let originalFetch: any;

    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = mock();
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    test("translateText should return translated text on success", async () => {
        const { translateText } = await import("./actions");

        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                responseStatus: 200,
                responseData: { translatedText: "Hola Mundo" }
            })
        });

        const result = await translateText("Hello World", "en", "es");

        expect(result.success).toBe(true);
        expect(result.data).toBe("Hola Mundo");
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test("translateText should handle API errors", async () => {
        const { translateText } = await import("./actions");

        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                responseStatus: 403,
                responseDetails: "Quota exceeded"
            })
        });

        const result = await translateText("Hello World", "en", "es");

        expect(result.success).toBe(false);
        expect(result.error).toContain("Quota exceeded");
    });

    test("getCachedTranslation should return translated text on success", async () => {
        const { getCachedTranslation } = await import("./actions");

        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                responseStatus: 200,
                responseData: { translatedText: "Hola Mundo" }
            })
        });

        const result = await getCachedTranslation("Hello World", "en", "es");

        expect(result).toBe("Hola Mundo");
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test("getCachedTranslation should throw on API errors", async () => {
        const { getCachedTranslation } = await import("./actions");

        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                responseStatus: 403,
                responseDetails: "Quota exceeded"
            })
        });

        // getCachedTranslation throws, so we expect it to reject
        expect(getCachedTranslation("Hello World", "en", "es")).rejects.toThrow("Quota exceeded");
    });
});
