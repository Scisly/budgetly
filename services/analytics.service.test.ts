import { describe, it, expect } from "vitest";
import {
  averageSavingsRate,
  calculateChangePercent,
  calculateSavingsRate,
} from "@/services/analytics.service";

describe("calculateSavingsRate", () => {
  it("returns savings rate percentage", () => {
    expect(calculateSavingsRate(5000, 4000)).toBe(20);
  });

  it("returns null when income is zero", () => {
    expect(calculateSavingsRate(0, 100)).toBeNull();
  });
});

describe("calculateChangePercent", () => {
  it("returns positive change", () => {
    expect(calculateChangePercent(120, 100)).toBe(20);
  });

  it("returns null when previous is zero and current is non-zero", () => {
    expect(calculateChangePercent(100, 0)).toBeNull();
  });

  it("returns zero when both values are zero", () => {
    expect(calculateChangePercent(0, 0)).toBe(0);
  });
});

describe("averageSavingsRate", () => {
  it("averages valid savings rates", () => {
    const average = averageSavingsRate([
      {
        month: 1,
        year: 2026,
        label: "styczeń 2026",
        savingsRate: 10,
        totalIncome: 1000,
        totalExpenses: 900,
        balance: 100,
      },
      {
        month: 2,
        year: 2026,
        label: "luty 2026",
        savingsRate: 30,
        totalIncome: 1000,
        totalExpenses: 700,
        balance: 300,
      },
    ]);

    expect(average).toBe(20);
  });
});
