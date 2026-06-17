"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { transactionSchema } from "@/lib/validations/transaction.schema";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/services/transaction.service";

export type TransactionActionState = {
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

function parseTransactionFormData(formData: FormData) {
  const description = formData.get("description");
  return transactionSchema.safeParse({
    category_id: formData.get("category_id"),
    amount: formData.get("amount"),
    description: description === null || description === "" ? "" : description,
    transaction_date: formData.get("transaction_date"),
    type: formData.get("type"),
    currency_code: formData.get("currency_code"),
  });
}

export async function createTransactionAction(
  formData: FormData
): Promise<TransactionActionState> {
  const parsed = parseTransactionFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await createTransaction(auth.supabase, auth.user.id, parsed.data);
    revalidatePath("/transactions");
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się utworzyć transakcji. Spróbuj ponownie.",
    };
  }
}

export async function updateTransactionAction(
  id: string,
  formData: FormData
): Promise<TransactionActionState> {
  if (!id) {
    return { error: "Brak identyfikatora transakcji." };
  }

  const parsed = parseTransactionFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await updateTransaction(auth.supabase, auth.user.id, id, parsed.data);
    revalidatePath("/transactions");
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się zaktualizować transakcji. Spróbuj ponownie.",
    };
  }
}

export async function deleteTransactionAction(
  id: string
): Promise<TransactionActionState> {
  if (!id) {
    return { error: "Brak identyfikatora transakcji." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await deleteTransaction(auth.supabase, auth.user.id, id);
    revalidatePath("/transactions");
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się usunąć transakcji. Spróbuj ponownie.",
    };
  }
}
