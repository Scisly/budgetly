"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BASE_CURRENCY } from "@/lib/money/currencies";

interface CurrencyAmountFieldProps {
  id: string;
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  currencyCode: string;
  baseCurrency?: string;
  required?: boolean;
  placeholder?: string;
}

export function CurrencyAmountField({
  id,
  label,
  amount,
  onAmountChange,
  currencyCode,
  baseCurrency = BASE_CURRENCY,
  required = false,
  placeholder = "0,00",
}: CurrencyAmountFieldProps) {
  const showBaseHint = currencyCode !== baseCurrency;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} ({currencyCode})
      </Label>
      <Input
        id={id}
        type="number"
        step="0.01"
        min="0.01"
        value={amount}
        onChange={(event) => onAmountChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        inputMode="decimal"
      />
      {showBaseHint && (
        <p className="text-xs text-muted-foreground">
          Wpisujesz kwotę w {currencyCode}. Przy zapisie zostanie przeliczona na{" "}
          {baseCurrency}.
        </p>
      )}
    </div>
  );
}
