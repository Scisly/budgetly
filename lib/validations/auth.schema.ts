import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Podaj poprawny adres email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

export const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
