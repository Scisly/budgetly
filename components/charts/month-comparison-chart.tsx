"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryComparison } from "@/services/compare.service";
import { useCurrency } from "@/components/providers/currency-provider";

interface MonthComparisonChartProps {
  data: CategoryComparison[];
  period1Label: string;
  period2Label: string;
}

function ChartTooltip({
  active,
  payload,
  label,
  period1Label,
  period2Label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
  period1Label: string;
  period2Label: string;
}) {
  const { formatAmount } = useCurrency();
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.dataKey === "period1" ? period1Label : period2Label}:{" "}
          {formatAmount(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function MonthComparisonChart({
  data,
  period1Label,
  period2Label,
}: MonthComparisonChartProps) {
  const { formatCompact } = useCurrency();

  if (data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    name: item.name,
    period1: item.period1Amount,
    period2: item.period2Amount,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          interval={0}
          angle={data.length > 4 ? -25 : 0}
          textAnchor={data.length > 4 ? "end" : "middle"}
          height={data.length > 4 ? 60 : 30}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatCompact(Number(value))}
        />
        <Tooltip
          content={
            <ChartTooltip
              period1Label={period1Label}
              period2Label={period2Label}
            />
          }
        />
        <Legend />
        <Bar
          dataKey="period1"
          name={period1Label}
          fill="var(--chart-1)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="period2"
          name={period2Label}
          fill="var(--chart-2)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
