import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/services/category.service";
import { getBudgetProgress } from "@/services/budget.service";
import { BudgetsManager } from "@/components/budgets/budgets-manager";

interface BudgetsPageProps {
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

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
  const params = await searchParams;
  const { month, year } = parseMonthYear(params);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categories = user ? await getCategories(supabase, user.id) : [];
  const budgets = user
    ? await getBudgetProgress(supabase, user.id, month, year)
    : [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Budżety</h2>
        <p className="text-muted-foreground">
          Ustawiaj limity wydatków i monitoruj, czy nie przekraczasz budżetu.
        </p>
      </div>

      <BudgetsManager
        budgets={budgets}
        categories={categories}
        month={month}
        year={year}
      />
    </div>
  );
}
