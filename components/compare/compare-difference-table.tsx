"use client";

import { CategoryIcon } from "@/components/categories/category-icon";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
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
import type {
  CategoryComparison,
  MonthComparisonResult,
} from "@/services/compare.service";

interface CompareDifferenceTableProps {
  comparison: MonthComparisonResult;
}

function differenceClassName(value: number) {
  return cn(
    value > 0 && "text-destructive",
    value < 0 && "text-success"
  );
}

function useFormatDifference() {
  const { formatAmount } = useCurrency();

  return (value: number) => {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${formatAmount(value)}`;
  };
}

export function CompareDifferenceTable({
  comparison,
}: CompareDifferenceTableProps) {
  const { formatAmount } = useCurrency();
  const formatDifference = useFormatDifference();

  if (comparison.categories.length === 0) {
    return (
      <EmptyState
        compact
        description="Brak wydatków do porównania w wybranych miesiącach."
      />
    );
  }

  const totalDifference = comparison.period2.total - comparison.period1.total;

  return (
    <>
      <div className="hidden md:block">
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategoria</TableHead>
                <TableHead className="text-right capitalize">
                  {comparison.period1.label}
                </TableHead>
                <TableHead className="text-right capitalize">
                  {comparison.period2.label}
                </TableHead>
                <TableHead className="text-right">Różnica</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparison.categories.map((item) => (
                <CompareTableRow key={item.category_id} item={item} />
              ))}
              <TableRow className="bg-muted/40 font-medium">
                <TableCell>Razem</TableCell>
                <TableCell className="text-right">
                  {formatAmount(comparison.period1.total)}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(comparison.period2.total)}
                </TableCell>
                <TableCell
                  className={cn("text-right", differenceClassName(totalDifference))}
                >
                  {formatDifference(totalDifference)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {comparison.categories.map((item) => (
          <CompareMobileCard
            key={item.category_id}
            item={item}
            period1Label={comparison.period1.label}
            period2Label={comparison.period2.label}
          />
        ))}
        <Card className="bg-muted/40">
          <CardContent className="space-y-2 pt-4">
            <p className="font-medium">Razem</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground capitalize">
                  {comparison.period1.label}
                </p>
                <p>{formatAmount(comparison.period1.total)}</p>
              </div>
              <div>
                <p className="text-muted-foreground capitalize">
                  {comparison.period2.label}
                </p>
                <p>{formatAmount(comparison.period2.total)}</p>
              </div>
            </div>
            <p className={cn("text-sm font-medium", differenceClassName(totalDifference))}>
              Różnica: {formatDifference(totalDifference)}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function CompareTableRow({ item }: { item: CategoryComparison }) {
  const { formatAmount } = useCurrency();
  const formatDifference = useFormatDifference();

  return (
    <TableRow>
      <TableCell>
        <CompareCategoryLabel item={item} />
      </TableCell>
      <TableCell className="text-right">
        {formatAmount(item.period1Amount)}
      </TableCell>
      <TableCell className="text-right">
        {formatAmount(item.period2Amount)}
      </TableCell>
      <TableCell className={cn("text-right", differenceClassName(item.difference))}>
        {formatDifference(item.difference)}
      </TableCell>
    </TableRow>
  );
}

function CompareCategoryLabel({ item }: { item: CategoryComparison }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex size-7 items-center justify-center rounded-md bg-muted"
        style={{ color: item.color }}
      >
        <CategoryIcon name={item.icon} className="size-3.5" />
      </span>
      <span>{item.name}</span>
    </div>
  );
}

function CompareMobileCard({
  item,
  period1Label,
  period2Label,
}: {
  item: CategoryComparison;
  period1Label: string;
  period2Label: string;
}) {
  const { formatAmount } = useCurrency();
  const formatDifference = useFormatDifference();

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <CompareCategoryLabel item={item} />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground capitalize">{period1Label}</p>
            <p>{formatAmount(item.period1Amount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground capitalize">{period2Label}</p>
            <p>{formatAmount(item.period2Amount)}</p>
          </div>
        </div>
        <p className={cn("text-sm font-medium", differenceClassName(item.difference))}>
          Różnica: {formatDifference(item.difference)}
        </p>
      </CardContent>
    </Card>
  );
}
