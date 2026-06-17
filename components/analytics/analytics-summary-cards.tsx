"use client";

import { ArrowDownIcon, ArrowUpIcon, PercentIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/components/providers/currency-provider";

interface AnalyticsSummaryCardsProps {
  averageSavingsRate: number | null;
  currentMonthIncome: number;
  currentMonthExpenses: number;
  periodLabel: string;
}

export function AnalyticsSummaryCards({
  averageSavingsRate,
  currentMonthIncome,
  currentMonthExpenses,
  periodLabel,
}: AnalyticsSummaryCardsProps) {
  const { formatAmount } = useCurrency();

  const stats = [
    {
      title: "Średni wskaźnik oszczędności (6 mies.)",
      value:
        averageSavingsRate === null ? "—" : `${averageSavingsRate}%`,
      icon: PercentIcon,
      className: "text-primary",
    },
    {
      title: `Przychody (${periodLabel})`,
      value: formatAmount(currentMonthIncome),
      icon: ArrowUpIcon,
      className: "text-success",
    },
    {
      title: `Wydatki (${periodLabel})`,
      value: formatAmount(currentMonthExpenses),
      icon: ArrowDownIcon,
      className: "text-destructive",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`size-4 ${stat.className}`} />
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${stat.className}`}>
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
