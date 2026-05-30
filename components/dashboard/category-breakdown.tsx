"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { useCurrency } from "@/components/providers/currency-provider";
import type { CategoryBreakdown } from "@/services/dashboard.service";

interface CategoryBreakdownListProps {
  data: CategoryBreakdown[];
}

export function CategoryBreakdownList({ data }: CategoryBreakdownListProps) {
  const { formatAmount } = useCurrency();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Wydatki per kategoria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CategoryPieChart data={data} />
        {data.length > 0 && (
          <ul className="space-y-2">
            {data.map((item) => (
              <li
                key={item.category_id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="text-muted-foreground">
                  {formatAmount(item.amount)}{" "}
                  <span className="text-xs">({item.percentage}%)</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
