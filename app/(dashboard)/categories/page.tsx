import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/services/category.service";
import { CategoriesManager } from "@/components/categories/categories-manager";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categories = user ? await getCategories(supabase, user.id) : [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Kategorie</h2>
        <p className="text-muted-foreground">
          Organizuj wydatki i przychody według własnych kategorii z ikonami i
          kolorami.
        </p>
      </div>

      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
