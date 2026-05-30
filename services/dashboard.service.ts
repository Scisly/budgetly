import type { SupabaseClient } from "@supabase/supabase-js";
import type { TransactionWithCategory } from "@/services/transaction.service";
import { getMonthlySummary, getTransactions } from "@/services/transaction.service";

export interface CategoryBreakdown {
  category_id: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface DashboardData {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: TransactionWithCategory[];
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

function normalizeCategory(
  category: { name: string; color: string } | { name: string; color: string }[] | null
): { name: string; color: string } | null {
  if (!category) return null;
  if (Array.isArray(category)) return category[0] ?? null;
  return category;
}

function buildCategoryBreakdown(
  rows: Array<{
    amount: number;
    category_id: string;
    category: { name: string; color: string } | { name: string; color: string }[] | null;
  }>
): CategoryBreakdown[] {
  const totals = new Map<
    string,
    { name: string; color: string; amount: number }
  >();

  for (const row of rows) {
    const key = row.category_id;
    const existing = totals.get(key);
    const amount = Number(row.amount);
    const category = normalizeCategory(row.category);
    if (existing) {
      existing.amount += amount;
    } else {
      totals.set(key, {
        name: category?.name ?? "Bez kategorii",
        color: category?.color ?? "#6366f1",
        amount,
      });
    }
  }

  const total = Array.from(totals.values()).reduce((sum, c) => sum + c.amount, 0);

  return Array.from(totals.entries())
    .map(([category_id, data]) => ({
      category_id,
      name: data.name,
      color: data.color,
      amount: data.amount,
      percentage: total > 0 ? Math.round((data.amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export async function getDashboardData(
  supabase: SupabaseClient,
  userId: string,
  month: number,
  year: number
): Promise<DashboardData> {
  const { dateFrom, dateTo } = getMonthDateRange(month, year);

  const [summary, transactions, expenseRows] = await Promise.all([
    getMonthlySummary(supabase, userId, month, year),
    getTransactions(supabase, userId, { date_from: dateFrom, date_to: dateTo }),
    supabase
      .from("transactions")
      .select("amount, category_id, category:categories(name, color)")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("transaction_date", dateFrom)
      .lte("transaction_date", dateTo),
  ]);

  if (expenseRows.error) {
    throw new Error("Nie udało się pobrać danych wykresu.");
  }

  return {
    ...summary,
    transactionCount: transactions.length,
    categoryBreakdown: buildCategoryBreakdown(expenseRows.data ?? []),
    recentTransactions: transactions.slice(0, 5),
  };
}
