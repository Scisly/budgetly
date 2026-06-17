"use client";

import Link from "next/link";
import { ArrowDownIcon, ArrowUpIcon, ScaleIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/components/providers/currency-provider";

interface DashboardStatsProps {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  transactionCount: number;
}

export function DashboardStats({
  totalExpenses,
  totalIncome,
  balance,
  transactionCount,
}: DashboardStatsProps) {
  const { formatAmount } = useCurrency();

  const stats = [
    {
      title: "Wydatki",
      value: formatAmount(totalExpenses),
      icon: ArrowDownIcon,
      className: "text-destructive",
    },
    {
      title: "Przychody",
      value: formatAmount(totalIncome),
      icon: ArrowUpIcon,
      className: "text-success",
    },
    {
      title: "Bilans",
      value: formatAmount(balance),
      icon: ScaleIcon,
      className:
        balance >= 0 ? "text-success" : "text-destructive",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="interactive-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`size-4 ${stat.className}`} />
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${stat.className}`}>{stat.value}</p>
          </CardContent>
        </Card>
      ))}
      <Card className="interactive-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Transakcje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{transactionCount}</p>
          <Link
            href="/transactions"
            className="text-xs text-primary hover:underline"
          >
            Zobacz wszystkie
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
