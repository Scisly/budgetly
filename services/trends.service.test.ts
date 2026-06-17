import { describe, it, expect } from "vitest";
import { buildTrendMonthRange } from "@/services/trends.service";

describe("buildTrendMonthRange", () => {
  it("includes six months ending at June 2026", () => {
    const range = buildTrendMonthRange(6, 2026, 6);
    expect(range).toEqual([
      { month: 6, year: 2026 },
      { month: 5, year: 2026 },
      { month: 4, year: 2026 },
      { month: 3, year: 2026 },
      { month: 2, year: 2026 },
      { month: 1, year: 2026 },
    ]);
  });

  it("crosses year boundary when ending in March 2026", () => {
    const range = buildTrendMonthRange(3, 2026, 6);
    expect(range).toEqual([
      { month: 3, year: 2026 },
      { month: 2, year: 2026 },
      { month: 1, year: 2026 },
      { month: 12, year: 2025 },
      { month: 11, year: 2025 },
      { month: 10, year: 2025 },
    ]);
  });
});
