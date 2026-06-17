import { z } from "zod";
import { CURRENCY_CODES } from "@/lib/money/currencies";

export const transactionSchema = z.object({
  category_id: z.string().uuid("Wybierz kategorię"),
  amount: z.coerce.number().positive("Kwota musi być większa od 0"),
  description: z.string().max(200).default(""),
  transaction_date: z.string().date("Podaj poprawną datę"),
  type: z.enum(["expense", "income"]),
  currency_code: z.enum(CURRENCY_CODES).default("PLN"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export const transactionFiltersSchema = z.object({
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  category_id: z.string().uuid().optional(),
  type: z.enum(["expense", "income"]).optional(),
});

export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;
