import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category, Transaction } from "@/lib/types/database.types";
import type {
  TransactionFilters,
  TransactionInput,
} from "@/lib/validations/transaction.schema";

export type TransactionWithCategory = Transaction & {
  category: Pick<Category, "name" | "color" | "icon"> | null;
};

export interface MonthlySummary {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
}

function getMonthDateRange(
  month: number,
  year: number
): { dateFrom: string; dateTo: string } {
  const monthStr = String(month).padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate();
  const dayStr = String(lastDay).padStart(2, "0");

  return {
    dateFrom: `${year}-${monthStr}-01`,
    dateTo: `${year}-${monthStr}-${dayStr}`,
  };
}

export async function getTransactions(
  supabase: SupabaseClient,
  userId: string,
  filters?: TransactionFilters
): Promise<TransactionWithCategory[]> {
  let query = supabase
    .from("transactions")
    .select("*, category:categories(name, color, icon)")
    .eq("user_id", userId);

  if (filters?.date_from) {
    query = query.gte("transaction_date", filters.date_from);
  }
  if (filters?.date_to) {
    query = query.lte("transaction_date", filters.date_to);
  }
  if (filters?.category_id) {
    query = query.eq("category_id", filters.category_id);
  }
  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  const { data, error } = await query
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Nie udało się pobrać transakcji.");
  }

  return data;
}

export async function createTransaction(
  supabase: SupabaseClient,
  userId: string,
  input: TransactionInput
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      category_id: input.category_id,
      amount: input.amount,
      description: input.description,
      transaction_date: input.transaction_date,
      type: input.type,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Nie udało się utworzyć transakcji.");
  }

  return data;
}

export async function updateTransaction(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  input: TransactionInput
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update({
      category_id: input.category_id,
      amount: input.amount,
      description: input.description,
      transaction_date: input.transaction_date,
      type: input.type,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Nie znaleziono transakcji.");
    }
    throw new Error("Nie udało się zaktualizować transakcji.");
  }

  return data;
}

export async function deleteTransaction(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Nie udało się usunąć transakcji.");
  }
}

export async function getMonthlySummary(
  supabase: SupabaseClient,
  userId: string,
  month: number,
  year: number
): Promise<MonthlySummary> {
  const { dateFrom, dateTo } = getMonthDateRange(month, year);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("user_id", userId)
    .gte("transaction_date", dateFrom)
    .lte("transaction_date", dateTo);

  if (error) {
    throw new Error("Nie udało się pobrać podsumowania miesiąca.");
  }

  let totalExpenses = 0;
  let totalIncome = 0;

  for (const row of data) {
    if (row.type === "expense") {
      totalExpenses += Number(row.amount);
    } else {
      totalIncome += Number(row.amount);
    }
  }

  return {
    totalExpenses,
    totalIncome,
    balance: totalIncome - totalExpenses,
  };
}
