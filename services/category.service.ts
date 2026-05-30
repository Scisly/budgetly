import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "@/lib/types/database.types";
import type { CategoryInput } from "@/lib/validations/category.schema";

export async function getCategories(
  supabase: SupabaseClient,
  userId: string
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Nie udało się pobrać kategorii.");
  }

  return data;
}

export async function createCategory(
  supabase: SupabaseClient,
  userId: string,
  input: CategoryInput
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: input.name,
      color: input.color,
      icon: input.icon,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Nie udało się utworzyć kategorii.");
  }

  return data;
}

export async function updateCategory(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  input: CategoryInput
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: input.name,
      color: input.color,
      icon: input.icon,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Nie znaleziono kategorii.");
    }
    throw new Error("Nie udało się zaktualizować kategorii.");
  }

  return data;
}

export async function deleteCategory(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Nie udało się usunąć kategorii.");
  }
}
