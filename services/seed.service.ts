import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_CATEGORIES = [
  { name: "Jedzenie", color: "#ef4444", icon: "utensils" },
  { name: "Transport", color: "#3b82f6", icon: "car" },
  { name: "Rozrywka", color: "#a855f7", icon: "gamepad-2" },
  { name: "Rachunki", color: "#f59e0b", icon: "receipt" },
  { name: "Zdrowie", color: "#22c55e", icon: "heart-pulse" },
] as const;

export async function seedDefaultCategories(
  supabase: SupabaseClient,
  userId: string
) {
  const { count, error: countError } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) throw countError;
  if (count && count > 0) return;

  const { error } = await supabase.from("categories").insert(
    DEFAULT_CATEGORIES.map((category) => ({
      user_id: userId,
      name: category.name,
      color: category.color,
      icon: category.icon,
    }))
  );

  if (error) throw error;
}
