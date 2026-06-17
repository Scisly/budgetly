"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/services/category.service";
import {
  buildTransactionInputs,
  parseTransactionsCsv,
  type ImportRowError,
} from "@/services/import.service";
import { createTransaction } from "@/services/transaction.service";

const MAX_CSV_LENGTH = 1_000_000;

export type ImportActionResult =
  | { imported: number; skipped: number; errors: ImportRowError[] }
  | { error: string };

function revalidateImportPaths() {
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/compare");
  revalidatePath("/budgets");
}

export async function importTransactionsAction(
  formData: FormData
): Promise<ImportActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Musisz być zalogowany, aby zaimportować dane." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Nie wybrano pliku CSV." };
  }

  if (file.size > MAX_CSV_LENGTH) {
    return { error: "Plik CSV jest za duży (maks. 1 MB)." };
  }

  const csv = await file.text();
  if (csv.length > MAX_CSV_LENGTH) {
    return { error: "Plik CSV jest za duży (maks. 1 MB)." };
  }

  const parsed = parseTransactionsCsv(csv);
  if (parsed.rows.length === 0) {
    return {
      imported: 0,
      skipped: 0,
      errors:
        parsed.errors.length > 0
          ? parsed.errors
          : [{ line: 1, message: "Brak wierszy do zaimportowania." }],
    };
  }

  try {
    const categories = await getCategories(supabase, user.id);
    const { inputs, errors } = buildTransactionInputs(parsed.rows, categories);
    const allErrors = [...parsed.errors, ...errors];

    let imported = 0;
    for (const input of inputs) {
      await createTransaction(supabase, user.id, input);
      imported++;
    }

    if (imported > 0) {
      revalidateImportPaths();
    }

    return {
      imported,
      skipped: parsed.rows.length - imported,
      errors: allErrors,
    };
  } catch {
    return { error: "Nie udało się zaimportować transakcji." };
  }
}
