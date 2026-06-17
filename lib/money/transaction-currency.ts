import { BASE_CURRENCY, type CurrencyCode } from "@/lib/money/currencies";

export function computeAmountBase(
  amount: number,
  currencyCode: CurrencyCode,
  rateToBase: number
): { amount_base: number; exchange_rate: number } {
  if (currencyCode === BASE_CURRENCY) {
    return { amount_base: amount, exchange_rate: 1 };
  }

  return {
    amount_base: Math.round(amount * rateToBase * 100) / 100,
    exchange_rate: rateToBase,
  };
}
