"use client";

import { CategoryIcon } from "@/components/categories/category-icon";
import { useCurrency } from "@/components/providers/currency-provider";
import { cn } from "@/lib/utils";
import type { BudgetProgress } from "@/services/budget.service";

interface BudgetCardProps {
  item: BudgetProgress;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_STYLES = {
  ok: {
    progress: "bg-emerald-500",
    badge: "text-emerald-600 dark:text-emerald-400",
    label: "W normie",
  },
  warning: {
    progress: "bg-amber-500",
    badge: "text-amber-600 dark:text-amber-400",
    label: "Blisko limitu",
  },
  exceeded: {
    progress: "bg-destructive",
    badge: "text-destructive",
    label: "Przekroczony",
  },
} as const;

export function BudgetCard({ item, onEdit, onDelete }: BudgetCardProps) {
  const { formatAmount } = useCurrency();
  const styles = STATUS_STYLES[item.status];
  const title = item.category?.name ?? "Budżet ogólny";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {item.category ? (
            <span
              className="flex size-9 items-center justify-center rounded-lg bg-muted"
              style={{ color: item.category.color }}
            >
              <CategoryIcon name={item.category.icon} className="size-4" />
            </span>
          ) : (
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground text-xs font-medium">
              ALL
            </span>
          )}
          <div>
            <p className="font-medium">{title}</p>
            <p className={cn("text-xs font-medium", styles.badge)}>
              {styles.label}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-primary hover:underline"
          >
            Edytuj
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-destructive hover:underline"
          >
            Usuń
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {formatAmount(item.spent)} / {formatAmount(item.limit)}
          </span>
          <span className="font-medium">{item.percentage}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full transition-all", styles.progress)}
            style={{ width: `${Math.min(item.percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
