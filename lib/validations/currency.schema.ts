import { z } from "zod";
import { CURRENCY_CODES } from "@/lib/money/currencies";

export const currencySchema = z.object({
  currency_code: z.enum(CURRENCY_CODES, {
    message: "Wybierz obsługiwaną walutę.",
  }),
});

export type CurrencyInput = z.infer<typeof currencySchema>;
