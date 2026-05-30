import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/services/dashboard.service";
import { getBudgetProgress, getExceededBudgets } from "@/services/budget.service";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { MonthSelector } from "@/components/dashboard/month-selector";
import { CategoryBreakdownList } from "@/components/dashboard/category-breakdown";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BudgetAlertBanner } from "@/components/dashboard/budget-alert-banner";

interface DashboardPageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

function parseMonthYear(params: { month?: string; year?: string }) {
  const now = new Date();
  const month = params.month ? Number(params.month) : now.getMonth() + 1;
  const year = params.year ? Number(params.year) : now.getFullYear();

  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !Number.isInteger(year) ||
    year < 2020
  ) {
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  }

  return { month, year };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const { month, year } = parseMonthYear(params);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = user
    ? await getDashboardData(supabase, user.id, month, year)
    : {
        totalExpenses: 0,
        totalIncome: 0,
        balance: 0,
        transactionCount: 0,
        categoryBreakdown: [],
        recentTransactions: [],
      };

  const budgetProgress = user
    ? await getBudgetProgress(supabase, user.id, month, year)
    : [];
  const exceededBudgets = getExceededBudgets(budgetProgress);

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Panel</h2>
          <p className="text-muted-foreground">
            Podsumowanie finansów za wybrany miesiąc.
          </p>
        </div>
        <MonthSelector month={month} year={year} />
      </div>

      <BudgetAlertBanner exceededBudgets={exceededBudgets} />

      <DashboardStats
        totalExpenses={data.totalExpenses}
        totalIncome={data.totalIncome}
        balance={data.balance}
        transactionCount={data.transactionCount}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryBreakdownList data={data.categoryBreakdown} />
        <RecentTransactions transactions={data.recentTransactions} />
      </div>
    </div>
  );
}
