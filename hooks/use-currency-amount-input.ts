"use client";

import { useCallback, useState } from "react";
import { useCurrency } from "@/components/providers/currency-provider";
import {
  fromFormAmountValue,
  toFormAmountValue,
} from "@/lib/money/format-currency";

export function useCurrencyAmountInput(
  baseAmount?: number | null
) {
  const { currencyCode, baseCurrency, rate } = useCurrency();
  const [amount, setAmount] = useState(() =>
    toFormAmountValue(baseAmount, rate)
  );

  const applyAmountToFormData = useCallback(
    (formData: FormData, fieldName = "amount") => {
      const parsed = Number(amount.replace(",", "."));

      if (!Number.isFinite(parsed) || parsed <= 0) {
        return;
      }

      formData.set(fieldName, fromFormAmountValue(parsed, rate));
    },
    [amount, rate]
  );

  return {
    amount,
    setAmount,
    currencyCode,
    baseCurrency,
    applyAmountToFormData,
  };
}
