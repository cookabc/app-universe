import { describe, expect, it, spyOn, afterEach } from "bun:test";
import { logger } from "./logger";

describe("Logger", () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        spyOn(console, 'debug').mockRestore();
        spyOn(console, 'info').mockRestore();
        spyOn(console, 'warn').mockRestore();
        spyOn(console, 'error').mockRestore();
    });

    it("should log debug in non-production", () => {
        process.env.NODE_ENV = "development";
        const spy = spyOn(console, "debug").mockImplementation(() => {});

        logger.debug("test debug");

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toContain("[DEBUG] test debug");
    });

    it("should NOT log debug in production", () => {
        process.env.NODE_ENV = "production";
        const spy = spyOn(console, "debug").mockImplementation(() => {});

        logger.debug("test debug");

        expect(spy).toHaveBeenCalledTimes(0);
    });

    it("should log info in production", () => {
        process.env.NODE_ENV = "production";
        const spy = spyOn(console, "info").mockImplementation(() => {});

        logger.info("test info");

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toContain("[INFO] test info");
    });

    it("should log warn in production", () => {
        process.env.NODE_ENV = "production";
        const spy = spyOn(console, "warn").mockImplementation(() => {});

        logger.warn("test warn");

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toContain("[WARN] test warn");
    });

    it("should log error in production", () => {
        process.env.NODE_ENV = "production";
        const spy = spyOn(console, "error").mockImplementation(() => {});

        logger.error("test error");

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toContain("[ERROR] test error");
    });
});
