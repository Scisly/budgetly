import { createClient } from "@/lib/supabase/server";
import { compareMonths } from "@/services/compare.service";
import { ComparePeriodSelector } from "@/components/compare/compare-period-selector";
import { CompareDifferenceTable } from "@/components/compare/compare-difference-table";
import { CompareSummaryCards } from "@/components/compare/compare-summary-cards";
import { MonthComparisonChart } from "@/components/charts/month-comparison-chart";

interface ComparePageProps {
  searchParams: Promise<{
    month1?: string;
    year1?: string;
    month2?: string;
    year2?: string;
  }>;
}

function parseMonth(value: string | undefined, fallback: number): number {
  const parsed = value ? Number(value) : fallback;
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 12) return fallback;
  return parsed;
}

function parseYear(value: string | undefined, fallback: number): number {
  const parsed = value ? Number(value) : fallback;
  if (!Number.isInteger(parsed) || parsed < 2020) return fallback;
  return parsed;
}

function parseComparePeriods(params: {
  month1?: string;
  year1?: string;
  month2?: string;
  year2?: string;
}) {
  const now = new Date();
  const defaultMonth2 = now.getMonth() + 1;
  const defaultYear2 = now.getFullYear();

  let defaultMonth1 = defaultMonth2 - 1;
  let defaultYear1 = defaultYear2;
  if (defaultMonth1 < 1) {
    defaultMonth1 = 12;
    defaultYear1 -= 1;
  }

  const month2 = parseMonth(params.month2, defaultMonth2);
  const year2 = parseYear(params.year2, defaultYear2);
  const month1 = parseMonth(params.month1, defaultMonth1);
  const year1 = parseYear(params.year1, defaultYear1);

  return { month1, year1, month2, year2 };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const { month1, year1, month2, year2 } = parseComparePeriods(params);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const comparison = user
    ? await compareMonths(supabase, user.id, month1, year1, month2, year2)
    : {
        period1: {
          month: month1,
          year: year1,
          label: "",
          total: 0,
        },
        period2: {
          month: month2,
          year: year2,
          label: "",
          total: 0,
        },
        categories: [],
      };

  const totalDifference = comparison.period2.total - comparison.period1.total;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Porównanie miesięcy
        </h2>
        <p className="text-muted-foreground">
          Porównaj wydatki według kategorii między dwoma miesiącami.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ComparePeriodSelector
          period={1}
          month={month1}
          year={year1}
          month1={month1}
          year1={year1}
          month2={month2}
          year2={year2}
          title="Miesiąc A"
        />
        <ComparePeriodSelector
          period={2}
          month={month2}
          year={year2}
          month1={month1}
          year1={year1}
          month2={month2}
          year2={year2}
          title="Miesiąc B"
        />
      </div>

      <CompareSummaryCards
        period1Label={comparison.period1.label}
        period2Label={comparison.period2.label}
        period1Total={comparison.period1.total}
        period2Total={comparison.period2.total}
        totalDifference={totalDifference}
      />

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-medium">Wydatki per kategoria</h3>
        <MonthComparisonChart
          data={comparison.categories}
          period1Label={comparison.period1.label}
          period2Label={comparison.period2.label}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Tabela różnic</h3>
        <CompareDifferenceTable comparison={comparison} />
      </div>
    </div>
  );
}
