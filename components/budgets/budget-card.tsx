"use client";

import { CategoryIcon } from "@/components/categories/category-icon";
import { useCurrency } from "@/components/providers/currency-provider";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { BudgetProgress } from "@/services/budget.service";

interface BudgetCardProps {
  item: BudgetProgress;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_STYLES = {
  ok: {
    progress: "bg-success",
    badge: "text-success",
    label: "W normie",
  },
  warning: {
    progress: "bg-warning",
    badge: "text-warning",
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
        <Progress value={Math.min(item.percentage, 100)} className="gap-0">
          <ProgressTrack className="h-2">
            <ProgressIndicator className={styles.progress} />
          </ProgressTrack>
        </Progress>
      </div>
    </div>
  );
}
