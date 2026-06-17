import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, addMonths, addYears, format, parseISO } from "date-fns";
import type { Category, FrequencyType, RecurringExpense, TransactionType } from "@/lib/types/database.types";
import type { RecurringInput } from "@/lib/validations/recurring.schema";
import { createTransaction } from "@/services/transaction.service";

export type RecurringExpenseWithCategory = RecurringExpense & {
  category: Pick<Category, "name" | "color" | "icon"> | null;
};

function normalizeCategory(
  category: Pick<Category, "name" | "color" | "icon"> | Pick<Category, "name" | "color" | "icon">[] | null
): Pick<Category, "name" | "color" | "icon"> | null {
  if (!category) return null;
  if (Array.isArray(category)) return category[0] ?? null;
  return category;
}

export function getTodayDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function calculateNextOccurrence(
  date: string,
  frequency: FrequencyType
): string {
  const current = parseISO(date);
  let next: Date;

  switch (frequency) {
    case "weekly":
      next = addDays(current, 7);
      break;
    case "monthly":
      next = addMonths(current, 1);
      break;
    case "yearly":
      next = addYears(current, 1);
      break;
  }

  return format(next, "yyyy-MM-dd");
}

export function getRecurringDefaultDescription(type: TransactionType): string {
  return type === "income" ? "Przychód cykliczny" : "Wydatek cykliczny";
}

export async function getRecurringExpenses(
  supabase: SupabaseClient,
  userId: string
): Promise<RecurringExpenseWithCategory[]> {
  const { data, error } = await supabase
    .from("recurring_expenses")
    .select("*, category:categories(name, color, icon)")
    .eq("user_id", userId)
    .order("next_occurrence", { ascending: true });

  if (error) {
    throw new Error("Nie udało się pobrać wydatków cyklicznych.");
  }

  return data.map((row) => ({
    ...(row as RecurringExpense),
    category: normalizeCategory(row.category),
  }));
}

export async function createRecurringExpense(
  supabase: SupabaseClient,
  userId: string,
  input: RecurringInput
): Promise<RecurringExpense> {
  const { data, error } = await supabase
    .from("recurring_expenses")
    .insert({
      user_id: userId,
      category_id: input.category_id,
      amount: input.amount,
      description: input.description,
      frequency: input.frequency,
      next_occurrence: input.next_occurrence,
      type: input.type,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Nie udało się utworzyć wydatku cyklicznego.");
  }

  return data;
}

export async function updateRecurringExpense(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  input: RecurringInput
): Promise<RecurringExpense> {
  const { data, error } = await supabase
    .from("recurring_expenses")
    .update({
      category_id: input.category_id,
      amount: input.amount,
      description: input.description,
      frequency: input.frequency,
      next_occurrence: input.next_occurrence,
      type: input.type,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Nie znaleziono wydatku cyklicznego.");
    }
    throw new Error("Nie udało się zaktualizować wydatku cyklicznego.");
  }

  return data;
}

export async function deleteRecurringExpense(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("recurring_expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Nie udało się usunąć wydatku cyklicznego.");
  }
}

export async function toggleRecurringActive(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  isActive: boolean
): Promise<RecurringExpense> {
  const { data, error } = await supabase
    .from("recurring_expenses")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Nie znaleziono wydatku cyklicznego.");
    }
    throw new Error("Nie udało się zmienić statusu wydatku cyklicznego.");
  }

  return data;
}

export async function processRecurringExpenses(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const today = getTodayDateString();

  const { data, error } = await supabase
    .from("recurring_expenses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .lte("next_occurrence", today);

  if (error) {
    throw new Error("Nie udało się przetworzyć wydatków cyklicznych.");
  }

  let generated = 0;

  for (const expense of data ?? []) {
    let nextOccurrence = expense.next_occurrence;

    while (nextOccurrence <= today) {
      await createTransaction(supabase, userId, {
        category_id: expense.category_id,
        amount: Number(expense.amount),
        currency_code: "PLN",
        description:
          expense.description ||
          getRecurringDefaultDescription(expense.type ?? "expense"),
        transaction_date: nextOccurrence,
        type: expense.type ?? "expense",
      });
      generated++;
      nextOccurrence = calculateNextOccurrence(
        nextOccurrence,
        expense.frequency
      );
    }

    const { error: updateError } = await supabase
      .from("recurring_expenses")
      .update({ next_occurrence: nextOccurrence })
      .eq("id", expense.id)
      .eq("user_id", userId);

    if (updateError) {
      throw new Error("Nie udało się zaktualizować wydatku cyklicznego.");
    }
  }

  return generated;
}

export function uniqueUserIds(rows: { user_id: string }[]): string[] {
  return [...new Set(rows.map((row) => row.user_id))];
}

export async function processAllUsersRecurringExpenses(
  supabase: SupabaseClient
): Promise<{ usersProcessed: number; transactionsGenerated: number }> {
  const { data: rows, error } = await supabase
    .from("recurring_expenses")
    .select("user_id")
    .eq("is_active", true);

  if (error) {
    throw new Error("Nie udało się pobrać użytkowników z cyklicznymi transakcjami.");
  }

  const userIds = uniqueUserIds(rows ?? []);
  let transactionsGenerated = 0;

  for (const userId of userIds) {
    transactionsGenerated += await processRecurringExpenses(supabase, userId);
  }

  return { usersProcessed: userIds.length, transactionsGenerated };
}
