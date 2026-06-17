"use client";

import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/components/providers/currency-provider";
import type { BudgetAlerts, BudgetProgress } from "@/services/budget.service";

interface BudgetAlertBannerProps {
  alerts: BudgetAlerts;
}

interface AlertBlockProps {
  budgets: BudgetProgress[];
  title: string;
  className: string;
  iconClassName: string;
  titleClassName: string;
}

function AlertBlock({
  budgets,
  title,
  className,
  iconClassName,
  titleClassName,
}: AlertBlockProps) {
  const { formatAmount } = useCurrency();

  if (budgets.length === 0) return null;

  return (
    <div role="alert" className={`rounded-xl border px-4 py-3 text-sm ${className}`}>
      <div className="flex gap-3">
        <AlertTriangleIcon className={`mt-0.5 size-4 shrink-0 ${iconClassName}`} />
        <div className="space-y-1">
          <p className={`font-medium ${titleClassName}`}>{title}</p>
          <ul className="text-muted-foreground">
            {budgets.map((item) => (
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

export function BudgetAlertBanner({ alerts }: BudgetAlertBannerProps) {
  const { warning, exceeded } = alerts;

  if (warning.length === 0 && exceeded.length === 0) return null;

  return (
    <div className="space-y-3">
      <AlertBlock
        budgets={exceeded}
        title={
          exceeded.length === 1
            ? "Przekroczono budżet"
            : `Przekroczono ${exceeded.length} budżety`
        }
        className="border-destructive/30 bg-destructive/10"
        iconClassName="text-destructive"
        titleClassName="text-destructive"
      />
      <AlertBlock
        budgets={warning}
        title="Zbliżasz się do limitu budżetu"
        className="border-warning/30 bg-warning/10"
        iconClassName="text-warning"
        titleClassName="text-warning"
      />
    </div>
  );
}
