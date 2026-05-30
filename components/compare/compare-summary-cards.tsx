"use client";

import { useCurrency } from "@/components/providers/currency-provider";

interface CompareSummaryCardsProps {
  period1Label: string;
  period2Label: string;
  period1Total: number;
  period2Total: number;
  totalDifference: number;
}

export function CompareSummaryCards({
  period1Label,
  period2Label,
  period1Total,
  period2Total,
  totalDifference,
}: CompareSummaryCardsProps) {
  const { formatAmount } = useCurrency();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground capitalize">{period1Label}</p>
        <p className="text-2xl font-semibold">{formatAmount(period1Total)}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground capitalize">{period2Label}</p>
        <p className="text-2xl font-semibold">{formatAmount(period2Total)}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Różnica łączna</p>
        <p className="text-2xl font-semibold">
          {totalDifference >= 0 ? "+" : ""}
          {formatAmount(totalDifference)}
        </p>
      </div>
    </div>
  );
}
