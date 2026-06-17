import { BASE_CURRENCY } from "@/lib/money/currencies";
import type { Transaction } from "@/lib/types/database.types";

export type AmountRow = {
  amount: number;
  amount_base?: number | null;
};

export function resolveAmountBase(row: AmountRow): number {
  const value = row.amount_base ?? row.amount;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeTransaction<T extends AmountRow & Record<string, unknown>>(
  row: T
): T & Pick<Transaction, "amount_base" | "currency_code" | "exchange_rate"> {
  const amount = Number(row.amount) || 0;

  return {
    ...row,
    amount_base: resolveAmountBase(row),
    currency_code: (row.currency_code as string | undefined) ?? BASE_CURRENCY,
    exchange_rate: Number(row.exchange_rate) || 1,
  };
}
