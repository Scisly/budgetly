import type { SupabaseClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export interface CategoryComparison {
  category_id: string;
  name: string;
  color: string;
  icon: string;
  period1Amount: number;
  period2Amount: number;
  difference: number;
}

export interface MonthComparisonResult {
  period1: {
    month: number;
    year: number;
    label: string;
    total: number;
  };
  period2: {
    month: number;
    year: number;
    label: string;
    total: number;
  };
  categories: CategoryComparison[];
}

function getMonthDateRange(month: number, year: number) {
  const monthStr = String(month).padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate();
  const dayStr = String(lastDay).padStart(2, "0");
  return {
    dateFrom: `${year}-${monthStr}-01`,
    dateTo: `${year}-${monthStr}-${dayStr}`,
  };
}

export function formatMonthLabel(month: number, year: number): string {
  return format(new Date(year, month - 1, 1), "LLLL yyyy", { locale: pl });
}

function normalizeCategory(
  category:
    | { name: string; color: string; icon: string }
    | { name: string; color: string; icon: string }[]
    | null
): { name: string; color: string; icon: string } | null {
  if (!category) return null;
  if (Array.isArray(category)) return category[0] ?? null;
  return category;
}

type ExpenseRow = {
  amount: number;
  category_id: string;
  category:
    | { name: string; color: string; icon: string }
    | { name: string; color: string; icon: string }[]
    | null;
};

function aggregateExpensesByCategory(rows: ExpenseRow[]) {
  const totals = new Map<
    string,
    { name: string; color: string; icon: string; amount: number }
  >();

  for (const row of rows) {
    const amount = Number(row.amount);
    const category = normalizeCategory(row.category);
    const existing = totals.get(row.category_id);

    if (existing) {
      existing.amount += amount;
    } else {
      totals.set(row.category_id, {
        name: category?.name ?? "Bez kategorii",
        color: category?.color ?? "#6366f1",
        icon: category?.icon ?? "circle",
        amount,
      });
    }
  }

  return totals;
}

export function buildCategoryComparison(
  period1Totals: Map<
    string,
    { name: string; color: string; icon: string; amount: number }
  >,
  period2Totals: Map<
    string,
    { name: string; color: string; icon: string; amount: number }
  >
): CategoryComparison[] {
  const categoryIds = new Set([
    ...period1Totals.keys(),
    ...period2Totals.keys(),
  ]);

  return Array.from(categoryIds)
    .map((category_id) => {
      const p1 = period1Totals.get(category_id);
      const p2 = period2Totals.get(category_id);
      const period1Amount = p1?.amount ?? 0;
      const period2Amount = p2?.amount ?? 0;

      return {
        category_id,
        name: p1?.name ?? p2?.name ?? "Bez kategorii",
        color: p1?.color ?? p2?.color ?? "#6366f1",
        icon: p1?.icon ?? p2?.icon ?? "circle",
        period1Amount,
        period2Amount,
        difference: period2Amount - period1Amount,
      };
    })
    .sort(
      (a, b) =>
        Math.max(b.period1Amount, b.period2Amount) -
        Math.max(a.period1Amount, a.period2Amount)
    );
}

async function getMonthlyExpensesByCategory(
  supabase: SupabaseClient,
  userId: string,
  month: number,
  year: number
) {
  const { dateFrom, dateTo } = getMonthDateRange(month, year);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, category_id, category:categories(name, color, icon)")
    .eq("user_id", userId)
    .eq("type", "expense")
    .gte("transaction_date", dateFrom)
    .lte("transaction_date", dateTo);

  if (error) {
    throw new Error("Nie udało się pobrać wydatków do porównania.");
  }

  return aggregateExpensesByCategory(data ?? []);
}

export async function compareMonths(
  supabase: SupabaseClient,
  userId: string,
  month1: number,
  year1: number,
  month2: number,
  year2: number
): Promise<MonthComparisonResult> {
  const [period1Totals, period2Totals] = await Promise.all([
    getMonthlyExpensesByCategory(supabase, userId, month1, year1),
    getMonthlyExpensesByCategory(supabase, userId, month2, year2),
  ]);

  const categories = buildCategoryComparison(period1Totals, period2Totals);

  const period1Total = Array.from(period1Totals.values()).reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const period2Total = Array.from(period2Totals.values()).reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return {
    period1: {
      month: month1,
      year: year1,
      label: formatMonthLabel(month1, year1),
      total: period1Total,
    },
    period2: {
      month: month2,
      year: year2,
      label: formatMonthLabel(month2, year2),
      total: period2Total,
    },
    categories,
  };
}
