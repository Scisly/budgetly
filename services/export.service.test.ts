import { describe, it, expect } from "vitest";
import { generateTransactionsCsv } from "@/services/export.service";

describe("generateTransactionsCsv", () => {
  it("generates CSV header and rows with currency", () => {
    const csv = generateTransactionsCsv([
      {
        transaction_date: "2026-05-01",
        description: "Zakupy",
        amount: 50,
        currency_code: "PLN",
        type: "expense",
        category_name: "Jedzenie",
      },
    ]);
    expect(csv).toContain("Data,Opis,Kwota,Waluta,Typ,Kategoria");
    expect(csv).toContain("2026-05-01,Zakupy,50,PLN,expense,Jedzenie");
  });

  it("escapes values containing commas", () => {
    const csv = generateTransactionsCsv([
      {
        transaction_date: "2026-05-01",
        description: "Zakupy, spożywcze",
        amount: 50,
        currency_code: "EUR",
        type: "expense",
        category_name: "Jedzenie",
      },
    ]);
    expect(csv).toContain('"Zakupy, spożywcze"');
    expect(csv).toContain(",EUR,expense,");
  });
});
