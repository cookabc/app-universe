import { describe, expect, test, beforeEach } from "bun:test";
import { QueueManager } from "./queue-manager";

describe("QueueManager", () => {
    let queueManager: QueueManager;

    beforeEach(() => {
        queueManager = new QueueManager(2); // Set maxWorkers to 2 for testing
    });

    describe("getNext", () => {
        test("should return null when the queue is empty", () => {
            expect(queueManager.getNext()).toBeNull();
        });

        test("should return the next request and update its status to processing", () => {
            const request = queueManager.add("A beautiful sunset");
            const nextRequest = queueManager.getNext();

            expect(nextRequest).not.toBeNull();
            expect(nextRequest?.id).toBe(request.id);
            expect(nextRequest?.status).toBe("processing");
            expect(queueManager.getStatus().processing).toContain(nextRequest!);
            expect(queueManager.getStatus().queue).not.toContain(nextRequest!);
        });

        test("should return requests in FIFO order", () => {
            const req1 = queueManager.add("Prompt 1");
            const req2 = queueManager.add("Prompt 2");

            const first = queueManager.getNext();
            const second = queueManager.getNext();

            expect(first?.id).toBe(req1.id);
            expect(second?.id).toBe(req2.id);
        });

        test("should return null when max workers are reached", () => {
            queueManager.add("Prompt 1");
            queueManager.add("Prompt 2");
            queueManager.add("Prompt 3");

            // Process first two
            const next1 = queueManager.getNext();
            const next2 = queueManager.getNext();

            expect(next1).not.toBeNull();
            expect(next2).not.toBeNull();
            expect(queueManager.getStatus().activeWorkers).toBe(2);

            // Third one should return null because maxWorkers is 2
            const next3 = queueManager.getNext();
            expect(next3).toBeNull();
            expect(queueManager.getStatus().queue.length).toBe(1);
        });

        test("should be able to get next after a request is completed", () => {
            queueManager.add("Prompt 1");
            queueManager.add("Prompt 2");
            queueManager.add("Prompt 3");

            const next1 = queueManager.getNext();
            const next2 = queueManager.getNext();

            expect(queueManager.getNext()).toBeNull();

            // Complete one request
            queueManager.complete(next1!.id, true);

            // Now we should be able to get the next one
            const next3 = queueManager.getNext();
            expect(next3).not.toBeNull();
            expect(next3?.prompt).toBe("Prompt 3");
        });
    });
});
