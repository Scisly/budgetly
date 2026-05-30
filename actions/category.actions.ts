"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validations/category.schema";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category.service";

export type CategoryActionState = {
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

function parseCategoryFormData(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
    icon: formData.get("icon"),
  });
}

export async function createCategoryAction(
  formData: FormData
): Promise<CategoryActionState> {
  const parsed = parseCategoryFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await createCategory(auth.supabase, auth.user.id, parsed.data);
    revalidatePath("/categories");
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się utworzyć kategorii. Spróbuj ponownie.",
    };
  }
}

export async function updateCategoryAction(
  id: string,
  formData: FormData
): Promise<CategoryActionState> {
  if (!id) {
    return { error: "Brak identyfikatora kategorii." };
  }

  const parsed = parseCategoryFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await updateCategory(auth.supabase, auth.user.id, id, parsed.data);
    revalidatePath("/categories");
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się zaktualizować kategorii. Spróbuj ponownie.",
    };
  }
}

export async function deleteCategoryAction(
  id: string
): Promise<CategoryActionState> {
  if (!id) {
    return { error: "Brak identyfikatora kategorii." };
  }

  const auth = await getAuthenticatedContext();
  if (auth.error || !auth.user) {
    return { error: auth.error ?? "Musisz być zalogowany." };
  }

  try {
    await deleteCategory(auth.supabase, auth.user.id, id);
    revalidatePath("/categories");
    return { success: true };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Nie udało się usunąć kategorii. Spróbuj ponownie.",
    };
  }
}
