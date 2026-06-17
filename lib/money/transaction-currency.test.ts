import { describe, it, expect } from "vitest";
import { BASE_CURRENCY } from "@/lib/money/currencies";
import { computeAmountBase } from "@/lib/money/transaction-currency";

describe("computeAmountBase", () => {
  it("returns same amount for base currency", () => {
    expect(computeAmountBase(100, BASE_CURRENCY, 1)).toEqual({
      amount_base: 100,
      exchange_rate: 1,
    });
  });

  it("converts foreign currency using rate to base", () => {
    expect(computeAmountBase(50, "EUR", 4.3)).toEqual({
      amount_base: 215,
      exchange_rate: 4.3,
    });
  });

  it("rounds base amount to two decimals", () => {
    expect(computeAmountBase(10, "USD", 3.999)).toEqual({
      amount_base: 39.99,
      exchange_rate: 3.999,
    });
  });
});
