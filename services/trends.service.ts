import type { SupabaseClient } from "@supabase/supabase-js";
import { formatMonthLabel } from "@/services/compare.service";
import { getMonthlySummary } from "@/services/transaction.service";

export interface MonthlyTrendPoint {
  month: number;
  year: number;
  label: string;
  totalExpenses: number;
  totalIncome: number;
  balance: number;
}

export interface TrendsData {
  points: MonthlyTrendPoint[];
}

export function buildTrendMonthRange(
  endMonth: number,
  endYear: number,
  count: number
): Array<{ month: number; year: number }> {
  const result: Array<{ month: number; year: number }> = [];
  let month = endMonth;
  let year = endYear;

  for (let i = 0; i < count; i++) {
    result.push({ month, year });
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
  }

  return result;
}

export async function getTrendsData(
  supabase: SupabaseClient,
  userId: string,
  months: number = 6
): Promise<TrendsData> {
  const now = new Date();
  const endMonth = now.getMonth() + 1;
  const endYear = now.getFullYear();
  const range = buildTrendMonthRange(endMonth, endYear, months);

  const points = await Promise.all(
    range.map(async ({ month, year }) => {
      const summary = await getMonthlySummary(supabase, userId, month, year);
      return {
        month,
        year,
        label: formatMonthLabel(month, year),
        ...summary,
      };
    })
  );

  return { points: points.reverse() };
}
