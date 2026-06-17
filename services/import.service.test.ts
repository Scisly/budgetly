import { describe, it, expect } from "vitest";
import { generateTransactionsCsv } from "@/services/export.service";
import {
  buildTransactionInputs,
  parseTransactionsCsv,
  resolveCategoryId,
} from "@/services/import.service";
import type { Category } from "@/lib/types/database.types";

const categories: Category[] = [
  {
    id: "cat-1",
    user_id: "user-1",
    name: "Jedzenie",
    color: "#000",
    icon: "utensils",
    created_at: "",
  },
];

describe("parseTransactionsCsv", () => {
  it("parses valid single row round-trip with export output", () => {
    const csv = generateTransactionsCsv([
      {
        transaction_date: "2026-05-01",
        description: "Zakupy",
        amount: 50,
        type: "expense",
        category_name: "Jedzenie",
      },
    ]);

    const result = parseTransactionsCsv(csv);
    expect(result.errors).toHaveLength(0);
    expect(result.rows).toEqual([
      {
        transaction_date: "2026-05-01",
        description: "Zakupy",
        amount: 50,
        type: "expense",
        category_name: "Jedzenie",
      },
    ]);
  });

  it("handles quoted description with comma", () => {
    const csv = generateTransactionsCsv([
      {
        transaction_date: "2026-05-01",
        description: "Zakupy, spożywcze",
        amount: 50,
        type: "expense",
        category_name: "Jedzenie",
      },
    ]);

    const result = parseTransactionsCsv(csv);
    expect(result.errors).toHaveLength(0);
    expect(result.rows[0]?.description).toBe("Zakupy, spożywcze");
  });

  it("rejects invalid header", () => {
    const result = parseTransactionsCsv("Wrong,Header\n2026-05-01,a,1,expense,b");
    expect(result.rows).toHaveLength(0);
    expect(result.errors[0]?.message).toContain("Nieprawidłowy nagłówek");
  });

  it("rejects invalid type", () => {
    const csv = "Data,Opis,Kwota,Typ,Kategoria\n2026-05-01,Zakupy,50,invalid,Jedzenie";
    const result = parseTransactionsCsv(csv);
    expect(result.rows).toHaveLength(0);
    expect(result.errors[0]?.message).toContain("Nieprawidłowy typ");
  });

  it("accepts Polish type aliases", () => {
    const csv =
      "Data,Opis,Kwota,Typ,Kategoria\n2026-05-01,Wynagrodzenie,5000,przychód,Jedzenie";
    const result = parseTransactionsCsv(csv);
    expect(result.errors).toHaveLength(0);
    expect(result.rows[0]?.type).toBe("income");
  });
});

describe("resolveCategoryId", () => {
  it("matches category names case-insensitively", () => {
    expect(resolveCategoryId("jedzenie", categories)).toBe("cat-1");
  });

  it("returns null when category is missing", () => {
    expect(resolveCategoryId("Transport", categories)).toBeNull();
  });
});

describe("buildTransactionInputs", () => {
  it("reports line number on category resolution failure", () => {
    const { inputs, errors } = buildTransactionInputs(
      [
        {
          transaction_date: "2026-05-01",
          description: "Zakupy",
          amount: 50,
          type: "expense",
          category_name: "Transport",
        },
      ],
      categories
    );

    expect(inputs).toHaveLength(0);
    expect(errors).toEqual([
      { line: 2, message: "Nie znaleziono kategorii: Transport" },
    ]);
  });
});
