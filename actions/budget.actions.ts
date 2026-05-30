"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { budgetSchema } from "@/lib/validations/budget.schema";
import {
  createBudget,
  updateBudget,
  deleteBudget,
} from "@/services/budget.service";

export type BudgetActionState = {
  error?: string;
  success?: boolean;
};

async function getAuthenticatedContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase,
      user: null,
      error: "Musisz być zalogowany, aby wykonać tę operację.",
    };
  }

  return { supabase, user, error: null };
}

function parseBudgetFormData(formData: FormData) {
  const categoryId = formData.get("category_id");
  return budgetSchema.safeParse({
    category_id: categoryId === "general" ? "" : categoryId,
    limit_amount: formData.get("limit_amount"),
    month: formData.get("month"),
    year: formData.get("year"),
  });
}

export async function createBudgetAction(
  formData: FormData
): Promise<BudgetActionState> {
  const parsed = parseBudgetFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await createBudget(auth.supabase, auth.user.id, parsed.data);
    revalidatePath("/budgets");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się utworzyć budżetu.",
    };
  }
}

export async function updateBudgetAction(
  id: string,
  formData: FormData
): Promise<BudgetActionState> {
  if (!id) return { error: "Brak identyfikatora budżetu." };

  const parsed = parseBudgetFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await updateBudget(auth.supabase, auth.user.id, id, parsed.data);
    revalidatePath("/budgets");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się zaktualizować budżetu.",
    };
  }
}

export async function deleteBudgetAction(
  id: string
): Promise<BudgetActionState> {
  if (!id) return { error: "Brak identyfikatora budżetu." };

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await deleteBudget(auth.supabase, auth.user.id, id);
    revalidatePath("/budgets");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Nie udało się usunąć budżetu.",
    };
  }
}
