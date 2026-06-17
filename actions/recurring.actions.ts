"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recurringSchema } from "@/lib/validations/recurring.schema";
import {
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  toggleRecurringActive,
} from "@/services/recurring.service";

export type RecurringActionState = {
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

function parseRecurringFormData(formData: FormData) {
  return recurringSchema.safeParse({
    category_id: formData.get("category_id"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    frequency: formData.get("frequency"),
    next_occurrence: formData.get("next_occurrence"),
    type: formData.get("type"),
  });
}

function revalidateRecurringPaths() {
  revalidatePath("/recurring");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}

export async function createRecurringAction(
  formData: FormData
): Promise<RecurringActionState> {
  const parsed = parseRecurringFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await createRecurringExpense(auth.supabase, auth.user.id, parsed.data);
    revalidateRecurringPaths();
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się utworzyć wydatku cyklicznego.",
    };
  }
}

export async function updateRecurringAction(
  id: string,
  formData: FormData
): Promise<RecurringActionState> {
  if (!id) return { error: "Brak identyfikatora wydatku cyklicznego." };

  const parsed = parseRecurringFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await updateRecurringExpense(auth.supabase, auth.user.id, id, parsed.data);
    revalidateRecurringPaths();
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się zaktualizować wydatku cyklicznego.",
    };
  }
}

export async function deleteRecurringAction(
  id: string
): Promise<RecurringActionState> {
  if (!id) return { error: "Brak identyfikatora wydatku cyklicznego." };

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await deleteRecurringExpense(auth.supabase, auth.user.id, id);
    revalidateRecurringPaths();
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się usunąć wydatku cyklicznego.",
    };
  }
}

export async function toggleRecurringActiveAction(
  id: string,
  isActive: boolean
): Promise<RecurringActionState> {
  if (!id) return { error: "Brak identyfikatora wydatku cyklicznego." };

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await toggleRecurringActive(auth.supabase, auth.user.id, id, isActive);
    revalidateRecurringPaths();
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się zmienić statusu wydatku cyklicznego.",
    };
  }
}
