import { z } from "zod";

export const recurringSchema = z.object({
  category_id: z.string().uuid("Wybierz kategorię"),
  amount: z.coerce.number().positive("Kwota musi być większa od 0"),
  description: z.string().max(200).default(""),
  frequency: z.enum(["weekly", "monthly", "yearly"], {
    message: "Wybierz częstotliwość",
  }),
  next_occurrence: z.string().date("Podaj poprawną datę"),
});

export type RecurringInput = z.infer<typeof recurringSchema>;
