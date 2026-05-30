import { z } from "zod";

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const categorySchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  color: z
    .string()
    .regex(hexColorRegex, "Podaj poprawny kolor w formacie hex (#RRGGBB)"),
  icon: z.string().min(1, "Ikona jest wymagana"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
