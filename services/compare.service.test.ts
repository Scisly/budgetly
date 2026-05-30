import { describe, it, expect } from "vitest";
import { buildCategoryComparison } from "@/services/compare.service";

describe("buildCategoryComparison", () => {
  it("merges categories from both periods and calculates difference", () => {
    const period1 = new Map([
      [
        "cat-1",
        { name: "Jedzenie", color: "#ef4444", icon: "utensils", amount: 500 },
      ],
    ]);
    const period2 = new Map([
      [
        "cat-1",
        { name: "Jedzenie", color: "#ef4444", icon: "utensils", amount: 650 },
      ],
      [
        "cat-2",
        { name: "Transport", color: "#3b82f6", icon: "car", amount: 200 },
      ],
    ]);

    const result = buildCategoryComparison(period1, period2);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      name: "Jedzenie",
      period1Amount: 500,
      period2Amount: 650,
      difference: 150,
    });
    expect(result.find((item) => item.name === "Transport")).toMatchObject({
      period1Amount: 0,
      period2Amount: 200,
      difference: 200,
    });
  });
});
