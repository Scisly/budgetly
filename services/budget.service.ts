import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveAmountBase, type AmountRow } from "@/lib/money/transaction-amounts";
import type { Budget, Category } from "@/lib/types/database.types";
import type { BudgetInput } from "@/lib/validations/budget.schema";

export type BudgetStatus = "ok" | "warning" | "exceeded";

export interface BudgetProgress {
  budget: Budget;
  category: Pick<Category, "name" | "color" | "icon"> | null;
  spent: number;
  limit: number;
  percentage: number;
  status: BudgetStatus;
}

export function getBudgetStatus(spent: number, limit: number): BudgetStatus {
  if (spent > limit) return "exceeded";
  if (spent > limit * 0.8) return "warning";
  return "ok";
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
  category: Pick<Category, "name" | "color" | "icon"> | Pick<Category, "name" | "color" | "icon">[] | null
): Pick<Category, "name" | "color" | "icon"> | null {
  if (!category) return null;
  if (Array.isArray(category)) return category[0] ?? null;
  return category;
}

export async function getBudgets(
  supabase: SupabaseClient,
  userId: string,
  month: number,
  year: number
): Promise<Budget[]> {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .eq("month", month)
    .eq("year", year)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Nie udało się pobrać budżetów.");
  }

  return data;
}

export async function getBudgetProgress(
  supabase: SupabaseClient,
  userId: string,
  month: number,
  year: number
): Promise<BudgetProgress[]> {
  const { dateFrom, dateTo } = getMonthDateRange(month, year);

  const [budgetsResult, transactionsResult] = await Promise.all([
    supabase
      .from("budgets")
      .select("*, category:categories(name, color, icon)")
      .eq("user_id", userId)
      .eq("month", month)
      .eq("year", year),
    supabase
      .from("transactions")
      .select("amount, amount_base, category_id")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("transaction_date", dateFrom)
      .lte("transaction_date", dateTo),
  ]);

  if (budgetsResult.error) {
    throw new Error("Nie udało się pobrać budżetów.");
  }

  let transactions: Array<AmountRow & { category_id: string }> =
    transactionsResult.data ?? [];

  if (transactionsResult.error) {
    const legacyResult = await supabase
      .from("transactions")
      .select("amount, category_id")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("transaction_date", dateFrom)
      .lte("transaction_date", dateTo);

    if (legacyResult.error) {
      throw new Error("Nie udało się obliczyć postępu budżetu.");
    }

    transactions = legacyResult.data ?? [];
  }

  const totalSpent = transactions.reduce(
    (sum, tx) => sum + resolveAmountBase(tx),
    0
  );

  const spentByCategory = new Map<string, number>();
  for (const tx of transactions) {
    const current = spentByCategory.get(tx.category_id) ?? 0;
    spentByCategory.set(tx.category_id, current + resolveAmountBase(tx));
  }

  return budgetsResult.data.map((row) => {
    const budget = row as Budget;
    const limit = Number(budget.limit_amount);
    const spent = budget.category_id
      ? (spentByCategory.get(budget.category_id) ?? 0)
      : totalSpent;
    const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 999) : 0;

    return {
      budget,
      category: normalizeCategory(row.category),
      spent,
      limit,
      percentage,
      status: getBudgetStatus(spent, limit),
    };
  });
}

export async function createBudget(
  supabase: SupabaseClient,
  userId: string,
  input: BudgetInput
): Promise<Budget> {
  const { data, error } = await supabase
    .from("budgets")
    .insert({
      user_id: userId,
      category_id: input.category_id,
      limit_amount: input.limit_amount,
      month: input.month,
      year: input.year,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Budżet dla tej kategorii i miesiąca już istnieje.");
    }
    throw new Error("Nie udało się utworzyć budżetu.");
  }

  return data;
}

export async function updateBudget(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  input: BudgetInput
): Promise<Budget> {
  const { data, error } = await supabase
    .from("budgets")
    .update({
      category_id: input.category_id,
      limit_amount: input.limit_amount,
      month: input.month,
      year: input.year,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Nie znaleziono budżetu.");
    }
    if (error.code === "23505") {
      throw new Error("Budżet dla tej kategorii i miesiąca już istnieje.");
    }
    throw new Error("Nie udało się zaktualizować budżetu.");
  }

  return data;
}

export async function deleteBudget(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Nie udało się usunąć budżetu.");
  }
}

export interface BudgetAlerts {
  warning: BudgetProgress[];
  exceeded: BudgetProgress[];
}

export function getWarningBudgets(progress: BudgetProgress[]): BudgetProgress[] {
  return progress.filter((item) => item.status === "warning");
}

export function getExceededBudgets(progress: BudgetProgress[]): BudgetProgress[] {
  return progress.filter((item) => item.status === "exceeded");
}

export function getBudgetAlerts(progress: BudgetProgress[]): BudgetAlerts {
  return {
    warning: getWarningBudgets(progress),
    exceeded: getExceededBudgets(progress),
  };
}
