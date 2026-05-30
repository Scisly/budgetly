"use server";

import { createClient } from "@/lib/supabase/server";
import { getTransactions } from "@/services/transaction.service";
import { generateTransactionsCsv } from "@/services/export.service";

export type ExportActionResult =
  | { csv: string; filename: string }
  | { error: string };

export async function exportTransactionsAction(): Promise<ExportActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Musisz być zalogowany, aby wyeksportować dane." };
  }

  try {
    const transactions = await getTransactions(supabase, user.id);
    const rows = transactions.map((transaction) => ({
      transaction_date: transaction.transaction_date,
      description: transaction.description,
      amount: Number(transaction.amount),
      type: transaction.type,
      category_name: transaction.category?.name ?? "",
    }));

    const csv = generateTransactionsCsv(rows);
    const filename = `budgetly-transakcje-${new Date().toISOString().slice(0, 10)}.csv`;

    return { csv, filename };
  } catch {
    return { error: "Nie udało się wyeksportować transakcji." };
  }
}
