"use client";

import { CategoryIcon } from "@/components/categories/category-icon";
import { EmptyState } from "@/components/shared/empty-state";
import { useCurrency } from "@/components/providers/currency-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { CategoryTrendRow } from "@/services/analytics.service";

interface AnalyticsCategoryMoversTableProps {
  movers: CategoryTrendRow[];
}

function changeClassName(value: number | null) {
  if (value === null) return "";
  return cn(value > 0 && "text-destructive", value < 0 && "text-success");
}

export function AnalyticsCategoryMoversTable({
  movers,
}: AnalyticsCategoryMoversTableProps) {
  const { formatAmount } = useCurrency();

  if (movers.length === 0) {
    return (
      <EmptyState
        compact
        description="Brak wydatków w bieżącym lub poprzednim miesiącu."
      />
    );
  }

  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kategoria</TableHead>
            <TableHead className="text-right">Poprzedni miesiąc</TableHead>
            <TableHead className="text-right">Bieżący miesiąc</TableHead>
            <TableHead className="text-right">Zmiana</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movers.map((row) => (
            <TableRow key={row.category_id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className="flex size-7 items-center justify-center rounded-md bg-muted"
                    style={{ color: row.color }}
                  >
                    <CategoryIcon name={row.icon} className="size-3.5" />
                  </span>
                  <span>{row.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(row.previousAmount)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(row.currentAmount)}
              </TableCell>
              <TableCell
                className={cn("text-right", changeClassName(row.changePercent))}
              >
                {row.changePercent === null ? "—" : `${row.changePercent}%`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
