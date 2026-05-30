import { describe, it, expect } from "vitest";
import {
  transactionSchema,
  transactionFiltersSchema,
} from "./transaction.schema";

const validUuid = "550e8400-e29b-41d4-a716-446655440000";

describe("transactionSchema", () => {
  it("accepts valid transaction data", () => {
    const result = transactionSchema.safeParse({
      category_id: validUuid,
      amount: 99.99,
      description: "Zakupy",
      transaction_date: "2026-05-22",
      type: "expense",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid category_id", () => {
    const result = transactionSchema.safeParse({
      category_id: "niepoprawny",
      amount: 50,
      transaction_date: "2026-05-22",
      type: "expense",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive amount", () => {
    const result = transactionSchema.safeParse({
      category_id: validUuid,
      amount: 0,
      transaction_date: "2026-05-22",
      type: "expense",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid transaction_date", () => {
    const result = transactionSchema.safeParse({
      category_id: validUuid,
      amount: 100,
      transaction_date: "22-05-2026",
      type: "income",
    });
    expect(result.success).toBe(false);
  });

  it("defaults description to empty string", () => {
    const result = transactionSchema.safeParse({
      category_id: validUuid,
      amount: 25,
      transaction_date: "2026-05-22",
      type: "income",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe("");
    }
  });
});

describe("transactionFiltersSchema", () => {
  it("accepts empty filters", () => {
    const result = transactionFiltersSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial filters", () => {
    const result = transactionFiltersSchema.safeParse({
      date_from: "2026-01-01",
      type: "expense",
    });
    expect(result.success).toBe(true);
  });
});
