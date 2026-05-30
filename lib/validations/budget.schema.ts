import { z } from "zod";

export const budgetSchema = z.object({
  category_id: z
    .union([z.string().uuid("Wybierz poprawną kategorię"), z.literal(""), z.null()])
    .optional()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  limit_amount: z.coerce
    .number()
    .positive("Limit musi być większy od 0"),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2020),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
