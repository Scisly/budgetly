import type { SupabaseClient } from "@supabase/supabase-js";
import { compareMonths, formatMonthLabel } from "@/services/compare.service";
import { getTrendsData, type MonthlyTrendPoint } from "@/services/trends.service";

export interface SavingsRatePoint {
  month: number;
  year: number;
  label: string;
  savingsRate: number | null;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategoryTrendRow {
  category_id: string;
  name: string;
  color: string;
  icon: string;
  currentAmount: number;
  previousAmount: number;
  changePercent: number | null;
}

export interface AnalyticsOverview {
  trendPoints: MonthlyTrendPoint[];
  savingsRates: SavingsRatePoint[];
  topCategoryMovers: CategoryTrendRow[];
  periodLabel: string;
  averageSavingsRate: number | null;
  currentMonthIncome: number;
  currentMonthExpenses: number;
}

export function calculateSavingsRate(
  income: number,
  expenses: number
): number | null {
  if (income <= 0) return null;
  return Math.round(((income - expenses) / income) * 100);
}

export function calculateChangePercent(
  current: number,
  previous: number
): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

function getPreviousMonth(month: number, year: number) {
  if (month === 1) {
    return { month: 12, year: year - 1 };
  }
  return { month: month - 1, year };
}

export function averageSavingsRate(rates: SavingsRatePoint[]): number | null {
  const validRates = rates
    .map((point) => point.savingsRate)
    .filter((rate): rate is number => rate !== null);

  if (validRates.length === 0) return null;
  return Math.round(
    validRates.reduce((sum, rate) => sum + rate, 0) / validRates.length
  );
}

export async function getAnalyticsOverview(
  supabase: SupabaseClient,
  userId: string
): Promise<AnalyticsOverview> {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const previous = getPreviousMonth(currentMonth, currentYear);

  const [trends, comparison] = await Promise.all([
    getTrendsData(supabase, userId, 12),
    compareMonths(
      supabase,
      userId,
      previous.month,
      previous.year,
      currentMonth,
      currentYear
    ),
  ]);

  const savingsRates: SavingsRatePoint[] = trends.points.map((point) => ({
    month: point.month,
    year: point.year,
    label: point.label,
    savingsRate: calculateSavingsRate(point.totalIncome, point.totalExpenses),
    totalIncome: point.totalIncome,
    totalExpenses: point.totalExpenses,
    balance: point.balance,
  }));

  const topCategoryMovers: CategoryTrendRow[] = comparison.categories
    .map((category) => ({
      category_id: category.category_id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      currentAmount: category.period2Amount,
      previousAmount: category.period1Amount,
      changePercent: calculateChangePercent(
        category.period2Amount,
        category.period1Amount
      ),
    }))
    .sort(
      (a, b) =>
        Math.abs(b.currentAmount - b.previousAmount) -
        Math.abs(a.currentAmount - a.previousAmount)
    )
    .slice(0, 5);

  const latestPoint = trends.points.at(-1);

  return {
    trendPoints: trends.points,
    savingsRates,
    topCategoryMovers,
    periodLabel: formatMonthLabel(currentMonth, currentYear),
    averageSavingsRate: averageSavingsRate(savingsRates.slice(-6)),
    currentMonthIncome: latestPoint?.totalIncome ?? 0,
    currentMonthExpenses: latestPoint?.totalExpenses ?? 0,
  };
}
