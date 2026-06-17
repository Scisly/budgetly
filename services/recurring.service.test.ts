import { describe, it, expect } from "vitest";
import {
  calculateNextOccurrence,
  getRecurringDefaultDescription,
} from "@/services/recurring.service";

describe("calculateNextOccurrence", () => {
  it("adds 1 month for monthly frequency", () => {
    expect(calculateNextOccurrence("2026-05-22", "monthly")).toBe("2026-06-22");
  });

  it("adds 7 days for weekly frequency", () => {
    expect(calculateNextOccurrence("2026-05-22", "weekly")).toBe("2026-05-29");
  });

  it("adds 1 year for yearly frequency", () => {
    expect(calculateNextOccurrence("2026-05-22", "yearly")).toBe("2027-05-22");
  });
});

describe("getRecurringDefaultDescription", () => {
  it("returns expense default description", () => {
    expect(getRecurringDefaultDescription("expense")).toBe("Wydatek cykliczny");
  });

  it("returns income default description", () => {
    expect(getRecurringDefaultDescription("income")).toBe("Przychód cykliczny");
  });
});
