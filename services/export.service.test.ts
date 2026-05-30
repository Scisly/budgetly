import { describe, it, expect } from "vitest";
import { generateTransactionsCsv } from "@/services/export.service";

describe("generateTransactionsCsv", () => {
  it("generates CSV header and rows", () => {
    const csv = generateTransactionsCsv([
      {
        transaction_date: "2026-05-01",
        description: "Zakupy",
        amount: 50,
        type: "expense",
        category_name: "Jedzenie",
      },
    ]);
    expect(csv).toContain("Data,Opis,Kwota,Typ,Kategoria");
    expect(csv).toContain("2026-05-01,Zakupy,50,expense,Jedzenie");
  });

  it("escapes values containing commas", () => {
    const csv = generateTransactionsCsv([
      {
        transaction_date: "2026-05-01",
        description: "Zakupy, spożywcze",
        amount: 50,
        type: "expense",
        category_name: "Jedzenie",
      },
    ]);
    expect(csv).toContain('"Zakupy, spożywcze"');
  });
});
