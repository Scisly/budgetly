"use client";

import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/components/providers/currency-provider";
import type { BudgetProgress } from "@/services/budget.service";

interface BudgetAlertBannerProps {
  exceededBudgets: BudgetProgress[];
}

export function BudgetAlertBanner({ exceededBudgets }: BudgetAlertBannerProps) {
  const { formatAmount } = useCurrency();

  if (exceededBudgets.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm"
    >
      <div className="flex gap-3">
        <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
        <div className="space-y-1">
          <p className="font-medium text-destructive">
            Przekroczono {exceededBudgets.length === 1 ? "budżet" : "budżety"}
          </p>
          <ul className="text-muted-foreground">
            {exceededBudgets.map((item) => (
              <li key={item.budget.id}>
                {item.category?.name ?? "Budżet ogólny"}:{" "}
                {formatAmount(item.spent)} / {formatAmount(item.limit)}
              </li>
            ))}
          </ul>
          <Link href="/budgets" className="text-primary hover:underline">
            Zobacz budżety
          </Link>
        </div>
      </div>
    </div>
  );
}
