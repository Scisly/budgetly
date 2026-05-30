import type { CurrencyCode } from "@/lib/money/currencies";

export interface DisplayCurrencyOptions {
  currencyCode: CurrencyCode;
  rate: number;
}

function getLocaleForCurrency(currencyCode: CurrencyCode): string {
  switch (currencyCode) {
    case "USD":
      return "en-US";
    case "GBP":
      return "en-GB";
    default:
      return "pl-PL";
  }
}

export function convertFromBase(
  amountInBase: number,
  rate: number
): number {
  return amountInBase * rate;
}

export function convertToBase(
  amountInDisplay: number,
  rate: number
): number {
  if (rate === 0) {
    return amountInDisplay;
  }

  return amountInDisplay / rate;
}

export function toFormAmountValue(
  amountInBase: number | null | undefined,
  rate: number
): string {
  if (amountInBase == null || !Number.isFinite(amountInBase) || amountInBase <= 0) {
    return "";
  }

  const displayAmount = convertFromBase(amountInBase, rate);
  return (Math.round(displayAmount * 100) / 100).toFixed(2);
}

export function fromFormAmountValue(
  amountInDisplay: number,
  rate: number
): string {
  return convertToBase(amountInDisplay, rate).toFixed(2);
}

export function formatCurrencyAmount(
  amountInBase: number,
  options: DisplayCurrencyOptions,
  config?: { compact?: boolean }
): string {
  const converted = convertFromBase(amountInBase, options.rate);

  return new Intl.NumberFormat(getLocaleForCurrency(options.currencyCode), {
    style: "currency",
    currency: options.currencyCode,
    ...(config?.compact
      ? { notation: "compact", maximumFractionDigits: 1 }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  }).format(converted);
}
