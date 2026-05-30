import { describe, expect, it } from "vitest";
import {
  convertFromBase,
  convertToBase,
  formatCurrencyAmount,
  fromFormAmountValue,
  toFormAmountValue,
} from "@/lib/money/format-currency";

describe("formatCurrencyAmount", () => {
  it("formats PLN without conversion", () => {
    const result = formatCurrencyAmount(1234.5, {
      currencyCode: "PLN",
      rate: 1,
    });

    expect(result).toContain("1");
    expect(result).toMatch(/234,50|234\.50/);
    expect(result).toMatch(/zł|PLN/i);
  });

  it("converts amount using exchange rate", () => {
    expect(convertFromBase(100, 0.23)).toBeCloseTo(23);
    expect(convertToBase(23, 0.23)).toBeCloseTo(100);
  });

  it("round-trips form amount values", () => {
    const display = toFormAmountValue(100, 0.23);
    expect(display).toBe("23.00");
    expect(fromFormAmountValue(Number(display), 0.23)).toBe("100.00");
  });

  it("formats EUR with converted amount", () => {
    const result = formatCurrencyAmount(100, {
      currencyCode: "EUR",
      rate: 0.23,
    });

    expect(result).toMatch(/23/);
    expect(result).toMatch(/€|EUR/i);
  });
});

describe("currencySchema", () => {
  it("accepts supported currency codes", async () => {
    const { currencySchema } = await import("@/lib/validations/currency.schema");
    const result = currencySchema.safeParse({ currency_code: "USD" });
    expect(result.success).toBe(true);
  });

  it("rejects unsupported currency codes", async () => {
    const { currencySchema } = await import("@/lib/validations/currency.schema");
    const result = currencySchema.safeParse({ currency_code: "BTC" });
    expect(result.success).toBe(false);
  });
});
