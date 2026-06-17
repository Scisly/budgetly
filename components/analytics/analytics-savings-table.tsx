"use client";

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
import type { SavingsRatePoint } from "@/services/analytics.service";

interface AnalyticsSavingsTableProps {
  savingsRates: SavingsRatePoint[];
}

export function AnalyticsSavingsTable({
  savingsRates,
}: AnalyticsSavingsTableProps) {
  const { formatAmount } = useCurrency();

  if (savingsRates.length === 0) {
    return (
      <EmptyState
        compact
        description="Brak danych do obliczenia wskaźnika oszczędności."
      />
    );
  }

  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Miesiąc</TableHead>
            <TableHead className="text-right">Przychody</TableHead>
            <TableHead className="text-right">Wydatki</TableHead>
            <TableHead className="text-right">Wskaźnik oszczędności</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savingsRates.map((point) => (
            <TableRow key={`${point.year}-${point.month}`}>
              <TableCell className="capitalize">{point.label}</TableCell>
              <TableCell className="text-right">
                {formatAmount(point.totalIncome)}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(point.totalExpenses)}
              </TableCell>
              <TableCell className="text-right">
                {point.savingsRate === null ? "—" : `${point.savingsRate}%`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
