import { createClient } from "@/lib/supabase/server";
import { AnalyticsCategoryMoversTable } from "@/components/analytics/analytics-category-movers-table";
import { AnalyticsSavingsTable } from "@/components/analytics/analytics-savings-table";
import { AnalyticsSummaryCards } from "@/components/analytics/analytics-summary-cards";
import { TrendsLineChart } from "@/components/charts/trends-line-chart";
import { getAnalyticsOverview } from "@/services/analytics.service";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const overview = user
    ? await getAnalyticsOverview(supabase, user.id)
    : {
        trendPoints: [],
        savingsRates: [],
        topCategoryMovers: [],
        periodLabel: "",
        averageSavingsRate: null,
        currentMonthIncome: 0,
        currentMonthExpenses: 0,
      };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Analityka</h2>
        <p className="text-muted-foreground">
          Trendy finansowe, wskaźnik oszczędności i zmiany w kategoriach
          wydatków.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Podsumowanie</h3>
        <AnalyticsSummaryCards
          averageSavingsRate={overview.averageSavingsRate}
          currentMonthIncome={overview.currentMonthIncome}
          currentMonthExpenses={overview.currentMonthExpenses}
          periodLabel={overview.periodLabel}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Trendy 12 miesięcy</h3>
        <div className="rounded-xl border border-border bg-card p-4">
          <TrendsLineChart points={overview.trendPoints} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Wskaźnik oszczędności</h3>
        <AnalyticsSavingsTable savingsRates={overview.savingsRates} />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Największe zmiany kategorii</h3>
        <AnalyticsCategoryMoversTable movers={overview.topCategoryMovers} />
      </section>
    </div>
  );
}
