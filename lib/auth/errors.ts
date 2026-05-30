import type { AuthError } from "@supabase/supabase-js";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  over_email_send_rate_limit:
    "Limit wysyłki emaili został przekroczony. Poczekaj ok. 1 godzinę i spróbuj ponownie.",
  email_address_invalid: "Podaj poprawny adres email.",
  user_already_exists: "Konto z tym adresem email już istnieje.",
  email_not_confirmed:
    "Email nie został potwierdzony. Sprawdź skrzynkę i kliknij link aktywacyjny.",
  invalid_credentials: "Nieprawidłowy email lub hasło.",
  signup_disabled: "Rejestracja jest obecnie wyłączona.",
};

export function mapAuthError(error: AuthError, fallback: string): string {
  if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }
  if (error.message.includes("Database error")) {
    return "Błąd bazy danych podczas rejestracji. Spróbuj ponownie za chwilę.";
  }
  if (error.message.includes("rate limit")) {
    return AUTH_ERROR_MESSAGES.over_email_send_rate_limit;
  }
  return fallback;
}
