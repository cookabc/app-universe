import { describe, expect, it } from "bun:test";
import { queueManager } from "./queue-manager";

describe("QueueManager", () => {
  it("should generate a unique and correctly formatted ID for new requests", () => {
    const prompt = "A futuristic city skyline";
    const request = queueManager.add(prompt);

    expect(request.id).toMatch(
      /^req-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(request.prompt).toBe(prompt);
    expect(request.status).toBe("queued");
  });

  it("should generate different IDs for multiple requests", () => {
    const req1 = queueManager.add("prompt 1");
    const req2 = queueManager.add("prompt 2");

    expect(req1.id).not.toBe(req2.id);
    expect(req1.id).toMatch(
      /^req-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(req2.id).toMatch(
      /^req-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});
