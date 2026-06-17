import { describe, it, expect } from "vitest";
import { resolveAmountBase } from "@/lib/money/transaction-amounts";

describe("resolveAmountBase", () => {
  it("prefers amount_base when present", () => {
    expect(resolveAmountBase({ amount: 50, amount_base: 215 })).toBe(215);
  });

  it("falls back to amount when amount_base is missing", () => {
    expect(resolveAmountBase({ amount: 100 })).toBe(100);
  });

  it("returns zero for invalid values", () => {
    expect(resolveAmountBase({ amount: NaN, amount_base: null })).toBe(0);
  });
});
