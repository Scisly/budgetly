import { describe, it, expect } from "vitest";
import {
  getBudgetStatus,
  getWarningBudgets,
  getExceededBudgets,
} from "@/services/budget.service";
import type { BudgetProgress } from "@/services/budget.service";

function makeProgress(
  id: string,
  spent: number,
  limit: number,
  status: BudgetProgress["status"]
): BudgetProgress {
  return {
    budget: {
      id,
      user_id: "user-1",
      category_id: null,
      limit_amount: limit,
      month: 6,
      year: 2026,
      created_at: "",
    },
    category: null,
    spent,
    limit,
    percentage: Math.round((spent / limit) * 100),
    status,
  };
}

describe("getBudgetStatus", () => {
  it("returns exceeded when spent > limit", () => {
    expect(getBudgetStatus(1200, 1000)).toBe("exceeded");
  });

  it("returns warning when spent > 80% of limit", () => {
    expect(getBudgetStatus(850, 1000)).toBe("warning");
  });

  it("returns ok when spent <= 80% of limit", () => {
    expect(getBudgetStatus(500, 1000)).toBe("ok");
  });

  it("returns ok at exactly 80%", () => {
    expect(getBudgetStatus(800, 1000)).toBe("ok");
  });

  it("returns exceeded at exactly over limit", () => {
    expect(getBudgetStatus(1000.01, 1000)).toBe("exceeded");
  });
});

describe("getWarningBudgets", () => {
  it("returns only warning items", () => {
    const progress = [
      makeProgress("1", 850, 1000, "warning"),
      makeProgress("2", 1100, 1000, "exceeded"),
      makeProgress("3", 500, 1000, "ok"),
    ];
    const result = getWarningBudgets(progress);
    expect(result).toHaveLength(1);
    expect(result[0].budget.id).toBe("1");
  });
});

describe("getExceededBudgets", () => {
  it("returns only exceeded items", () => {
    const progress = [
      makeProgress("1", 850, 1000, "warning"),
      makeProgress("2", 1100, 1000, "exceeded"),
      makeProgress("3", 500, 1000, "ok"),
    ];
    const result = getExceededBudgets(progress);
    expect(result).toHaveLength(1);
    expect(result[0].budget.id).toBe("2");
  });

  it("excludes ok budgets from both warning and exceeded", () => {
    const progress = [makeProgress("3", 500, 1000, "ok")];
    expect(getWarningBudgets(progress)).toHaveLength(0);
    expect(getExceededBudgets(progress)).toHaveLength(0);
  });
});
