import { describe, expect, test } from "bun:test";
import { parseEvents } from "./eventParser";
import { type EventItem } from "../types";

describe("parseEvents", () => {
  test("returns empty array for null input", () => {
    expect(parseEvents(null)).toEqual([]);
  });

  test("returns empty array for empty string", () => {
    expect(parseEvents("")).toEqual([]);
  });

  test("returns empty array for invalid JSON", () => {
    expect(parseEvents("{invalid}")).toEqual([]);
  });

  test("returns empty array if parsed JSON is not an array", () => {
    expect(parseEvents('{"foo":"bar"}')).toEqual([]);
  });

  test("parses valid event data correctly", () => {
    const validData = [
      {
        id: "123",
        name: "Test Event",
        date: "2023-10-27T10:00:00.000Z",
        isAllDay: true,
        alertEnabled: false,
        repeatOption: "Weekly",
        category: "Meeting",
        color: "#123456",
        textColor: "#654321",
        type: "future",
      },
    ];
    const json = JSON.stringify(validData);
    const result = parseEvents(json);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "123",
      name: "Test Event",
      date: new Date("2023-10-27T10:00:00.000Z"),
      isAllDay: true,
      alertEnabled: false,
      repeatOption: "Weekly",
      category: "Meeting",
      color: "#123456",
      textColor: "#654321",
      type: "future",
    } as EventItem);
  });

  test("filters out null or non-object items", () => {
    const raw = JSON.stringify([null, "string", 123, { name: "Valid" }]);
    const result = parseEvents(raw);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Valid");
  });

  test("assigns default values for missing fields", () => {
    const raw = JSON.stringify([{}]);
    const result = parseEvents(raw);

    expect(result).toHaveLength(1);
    const item = result[0];

    expect(typeof item.id).toBe("string");
    expect(item.id.length).toBeGreaterThan(0);
    expect(item.name).toBe("Untitled Event");
    expect(item.date).toBeInstanceOf(Date);
    expect(item.isAllDay).toBe(false);
    expect(item.alertEnabled).toBe(true);
    expect(item.repeatOption).toBe("Never");
    expect(item.category).toBe("General");
    expect(item.color).toBe("#007AFF");
    expect(item.textColor).toBe("#FFFFFF");
    expect(item.type).toBe("future");
  });

  test("validates category", () => {
    const raw = JSON.stringify([{ category: "InvalidCategory" }]);
    const result = parseEvents(raw);
    expect(result[0].category).toBe("General");
  });

  test("validates type", () => {
    const raw = JSON.stringify([{ type: "invalidType" }]);
    const result = parseEvents(raw);
    expect(result[0].type).toBe("future");
  });

  test("preserves extra fields", () => {
    const raw = JSON.stringify([{ extraField: "extra" }]);
    const result = parseEvents(raw);
    expect((result[0] as any).extraField).toBe("extra");
  });

  test("handles invalid date strings by defaulting to now", () => {
     const raw = JSON.stringify([{ date: "invalid-date" }]);
     const result = parseEvents(raw);

     expect(result[0].date).toBeInstanceOf(Date);
     expect(isNaN(result[0].date.getTime())).toBe(false);
  });
});
