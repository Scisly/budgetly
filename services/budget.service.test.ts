import { describe, it, expect } from "vitest";
import { getBudgetStatus } from "@/services/budget.service";

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
