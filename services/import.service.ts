import { z } from "zod";
import { CURRENCY_CODES, type CurrencyCode } from "@/lib/money/currencies";
import type { Category } from "@/lib/types/database.types";
import type { TransactionInput } from "@/lib/validations/transaction.schema";

const CSV_HEADER_LEGACY = "Data,Opis,Kwota,Typ,Kategoria";
const CSV_HEADER = "Data,Opis,Kwota,Waluta,Typ,Kategoria";

const parsedRowSchema = z.object({
  transaction_date: z.string().date("Nieprawidłowa data"),
  description: z.string().max(200, "Opis jest za długi"),
  amount: z.coerce.number().positive("Kwota musi być większa od 0"),
  currency_code: z.enum(CURRENCY_CODES).default("PLN"),
  type: z.enum(["expense", "income"], { message: "Nieprawidłowy typ" }),
  category_name: z.string().min(1, "Brak kategorii"),
});

export interface ParsedCsvRow {
  transaction_date: string;
  description: string;
  amount: number;
  currency_code: CurrencyCode;
  type: "expense" | "income";
  category_name: string;
}

export interface ImportRowError {
  line: number;
  message: string;
}

export interface ImportParseResult {
  rows: ParsedCsvRow[];
  errors: ImportRowError[];
}

const TYPE_ALIASES: Record<string, "expense" | "income"> = {
  expense: "expense",
  income: "income",
  wydatek: "expense",
  przychód: "income",
  przychod: "income",
};

function stripBom(csv: string): string {
  return csv.startsWith("\uFEFF") ? csv.slice(1) : csv;
}

export function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      fields.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields;
}

function normalizeType(rawType: string): "expense" | "income" | null {
  const normalized = rawType.trim().toLowerCase();
  return TYPE_ALIASES[normalized] ?? null;
}

export function parseTransactionsCsv(csv: string): ImportParseResult {
  const trimmed = stripBom(csv).trim();
  if (!trimmed) {
    return { rows: [], errors: [{ line: 1, message: "Plik CSV jest pusty." }] };
  }

  const lines = trimmed.split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length === 0) {
    return { rows: [], errors: [{ line: 1, message: "Plik CSV jest pusty." }] };
  }

  const header = lines[0].trim();
  const hasCurrencyColumn = header === CSV_HEADER;
  const isLegacyHeader = header === CSV_HEADER_LEGACY;

  if (!hasCurrencyColumn && !isLegacyHeader) {
    return {
      rows: [],
      errors: [
        {
          line: 1,
          message: `Nieprawidłowy nagłówek CSV. Oczekiwano: ${CSV_HEADER}`,
        },
      ],
    };
  }

  const expectedColumns = hasCurrencyColumn ? 6 : 5;
  const rows: ParsedCsvRow[] = [];
  const errors: ImportRowError[] = [];

  for (let i = 1; i < lines.length; i++) {
    const lineNumber = i + 1;
    const fields = parseCsvLine(lines[i]);

    if (fields.length !== expectedColumns) {
      errors.push({
        line: lineNumber,
        message: "Nieprawidłowa liczba kolumn.",
      });
      continue;
    }

    let transaction_date: string;
    let description: string;
    let amountRaw: string;
    let currencyCode = "PLN";
    let typeRaw: string;
    let category_name: string;

    if (hasCurrencyColumn) {
      [transaction_date, description, amountRaw, currencyCode, typeRaw, category_name] =
        fields;
    } else {
      [transaction_date, description, amountRaw, typeRaw, category_name] = fields;
    }

    const type = normalizeType(typeRaw);

    if (!type) {
      errors.push({
        line: lineNumber,
        message: `Nieprawidłowy typ: ${typeRaw}`,
      });
      continue;
    }

    const parsed = parsedRowSchema.safeParse({
      transaction_date,
      description,
      amount: amountRaw,
      currency_code: currencyCode.trim().toUpperCase(),
      type,
      category_name,
    });

    if (!parsed.success) {
      errors.push({
        line: lineNumber,
        message: parsed.error.issues[0]?.message ?? "Nieprawidłowy wiersz.",
      });
      continue;
    }

    rows.push(parsed.data);
  }

  return { rows, errors };
}

export function resolveCategoryId(
  categoryName: string,
  categories: Category[]
): string | null {
  const normalized = categoryName.trim().toLowerCase();
  const match = categories.find(
    (category) => category.name.trim().toLowerCase() === normalized
  );
  return match?.id ?? null;
}

export function buildTransactionInputs(
  rows: ParsedCsvRow[],
  categories: Category[]
): { inputs: TransactionInput[]; errors: ImportRowError[] } {
  const inputs: TransactionInput[] = [];
  const errors: ImportRowError[] = [];

  rows.forEach((row, index) => {
    const categoryId = resolveCategoryId(row.category_name, categories);
    if (!categoryId) {
      errors.push({
        line: index + 2,
        message: `Nie znaleziono kategorii: ${row.category_name}`,
      });
      return;
    }

    inputs.push({
      category_id: categoryId,
      amount: row.amount,
      currency_code: row.currency_code,
      description: row.description,
      transaction_date: row.transaction_date,
      type: row.type,
    });
  });

  return { inputs, errors };
}
