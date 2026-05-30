import { format, parseISO } from "date-fns";
import { BASE_CURRENCY } from "@/lib/money/currencies";
import { formatCurrencyAmount } from "@/lib/money/format-currency";
import type { TransactionType } from "@/lib/types/database.types";

export const TYPE_LABELS: Record<TransactionType, string> = {
  expense: "Wydatek",
  income: "Przychód",
};

/** @deprecated Prefer `useCurrency().formatAmount` in client components. */
export function formatCurrency(amount: number): string {
  return formatCurrencyAmount(amount, {
    currencyCode: BASE_CURRENCY,
    rate: 1,
  });
}

export function formatTransactionDate(date: string): string {
  return format(parseISO(date), "dd.MM.yyyy");
}
