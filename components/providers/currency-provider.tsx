"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { BASE_CURRENCY, type CurrencyCode } from "@/lib/money/currencies";
import {
  convertFromBase,
  formatCurrencyAmount,
  type DisplayCurrencyOptions,
} from "@/lib/money/format-currency";

interface CurrencyContextValue extends DisplayCurrencyOptions {
  baseCurrency: typeof BASE_CURRENCY;
  formatAmount: (amountInBase: number) => string;
  formatCompact: (amountInBase: number) => string;
  convertAmount: (amountInBase: number) => number;
}

const defaultContext: CurrencyContextValue = {
  baseCurrency: BASE_CURRENCY,
  currencyCode: BASE_CURRENCY,
  rate: 1,
  formatAmount: (amount) =>
    formatCurrencyAmount(amount, { currencyCode: BASE_CURRENCY, rate: 1 }),
  formatCompact: (amount) =>
    formatCurrencyAmount(
      amount,
      { currencyCode: BASE_CURRENCY, rate: 1 },
      { compact: true }
    ),
  convertAmount: (amount) => amount,
};

const CurrencyContext = createContext<CurrencyContextValue>(defaultContext);

interface CurrencyProviderProps {
  children: ReactNode;
  currencyCode: CurrencyCode;
  rate: number;
}

export function CurrencyProvider({
  children,
  currencyCode,
  rate,
}: CurrencyProviderProps) {
  const options = useMemo(
    () => ({ currencyCode, rate }),
    [currencyCode, rate]
  );

  const formatAmount = useCallback(
    (amountInBase: number) => formatCurrencyAmount(amountInBase, options),
    [options]
  );

  const formatCompact = useCallback(
    (amountInBase: number) =>
      formatCurrencyAmount(amountInBase, options, { compact: true }),
    [options]
  );

  const convertAmount = useCallback(
    (amountInBase: number) => convertFromBase(amountInBase, rate),
    [rate]
  );

  const value = useMemo(
    () => ({
      baseCurrency: BASE_CURRENCY,
      currencyCode,
      rate,
      formatAmount,
      formatCompact,
      convertAmount,
    }),
    [currencyCode, rate, formatAmount, formatCompact, convertAmount]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext);
}
