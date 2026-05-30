"use client";

import { useCallback, useEffect, useState } from "react";
import { useCurrency } from "@/components/providers/currency-provider";
import {
  fromFormAmountValue,
  toFormAmountValue,
} from "@/lib/money/format-currency";

export function useCurrencyAmountInput(
  baseAmount?: number | null,
  enabled = true
) {
  const { currencyCode, baseCurrency, rate } = useCurrency();
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!enabled) return;

    setAmount(toFormAmountValue(baseAmount, rate));
  }, [baseAmount, enabled, rate]);

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
