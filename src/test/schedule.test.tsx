import { describe, expect, it } from "vitest";
import { advanceSchedule, generateEvents } from "@/data/events";

describe("live schedule simulation", () => {
  it("has at least 60 events over 3 days", () => {
    const e = generateEvents();
    expect(e.length).toBeGreaterThanOrEqual(60);
    expect(new Set(e.map((x) => x.day)).size).toBe(3);
  });
  it("completes the current live event and starts the next upcoming one", () => {
    const e = generateEvents();
    const firstLive = e.find((x) => x.status === "Live")!;
    const changes = advanceSchedule(e);
    expect(changes).toContainEqual({ id: firstLive.id, status: "Completed" });
    expect(changes.some((c) => c.status === "Live")).toBe(true);
  });
});
