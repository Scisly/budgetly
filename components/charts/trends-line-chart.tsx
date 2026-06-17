"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "@/components/shared/empty-state";
import { useCurrency } from "@/components/providers/currency-provider";
import type { MonthlyTrendPoint } from "@/services/trends.service";

interface TrendsLineChartProps {
  points: MonthlyTrendPoint[];
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
}) {
  const { formatAmount } = useCurrency();
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.dataKey === "totalExpenses" ? "Wydatki" : "Przychody"}:{" "}
          {formatAmount(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function TrendsLineChart({ points }: TrendsLineChartProps) {
  const { formatCompact } = useCurrency();

  const hasData = points.some(
    (point) => point.totalExpenses > 0 || point.totalIncome > 0
  );

  if (points.length === 0 || !hasData) {
    return (
      <EmptyState description="Brak danych do wyświetlenia trendów w ostatnich miesiącach." />
    );
  }

  const chartData = points.map((point) => ({
    name: point.label.slice(0, 3),
    totalExpenses: point.totalExpenses,
    totalIncome: point.totalIncome,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatCompact(Number(value))}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalExpenses"
          name="Wydatki"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="totalIncome"
          name="Przychody"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
