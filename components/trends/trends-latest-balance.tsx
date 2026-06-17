"use client";

import { useCurrency } from "@/components/providers/currency-provider";

interface TrendsLatestBalanceProps {
  label: string;
  balance: number;
}

export function TrendsLatestBalance({ label, balance }: TrendsLatestBalanceProps) {
  const { formatAmount } = useCurrency();

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">Saldo w {label}</p>
      <p className="text-2xl font-semibold">{formatAmount(balance)}</p>
    </div>
  );
}
