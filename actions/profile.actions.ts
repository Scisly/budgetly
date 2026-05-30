"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { currencySchema } from "@/lib/validations/currency.schema";
import { updateProfileCurrency } from "@/services/currency.service";

export type ProfileActionState = {
  error?: string;
  success?: boolean;
};

export async function updateCurrencyAction(
  formData: FormData
): Promise<ProfileActionState> {
  const parsed = currencySchema.safeParse({
    currency_code: formData.get("currency_code"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Nieprawidłowa waluta.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Musisz być zalogowany, aby zmienić walutę." };
  }

  try {
    await updateProfileCurrency(
      supabase,
      user.id,
      parsed.data.currency_code
    );
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Nie udało się zapisać preferencji waluty.",
    };
  }
}
