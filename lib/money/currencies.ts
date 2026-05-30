export const BASE_CURRENCY = "PLN" as const;

export const SUPPORTED_CURRENCIES = [
  { code: "PLN", label: "Polski złoty (PLN)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "USD", label: "Dolar amerykański (USD)" },
  { code: "GBP", label: "Funt brytyjski (GBP)" },
  { code: "CHF", label: "Frank szwajcarski (CHF)" },
  { code: "CZK", label: "Korona czeska (CZK)" },
  { code: "SEK", label: "Korona szwedzka (SEK)" },
  { code: "NOK", label: "Korona norweska (NOK)" },
  { code: "DKK", label: "Korona duńska (DKK)" },
  { code: "HUF", label: "Forint węgierski (HUF)" },
  { code: "UAH", label: "Hrywna ukraińska (UAH)" },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]["code"];

export const CURRENCY_CODES = SUPPORTED_CURRENCIES.map(
  (currency) => currency.code
) as [CurrencyCode, ...CurrencyCode[]];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCY_CODES.includes(value as CurrencyCode);
}

export function getCurrencyLabel(code: CurrencyCode): string {
  return (
    SUPPORTED_CURRENCIES.find((currency) => currency.code === code)?.label ??
    code
  );
}
