import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/services/category.service";
import { getRecurringExpenses } from "@/services/recurring.service";
import { RecurringManager } from "@/components/recurring/recurring-manager";

export default async function RecurringPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categories = user ? await getCategories(supabase, user.id) : [];
  const expenses = user ? await getRecurringExpenses(supabase, user.id) : [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Wydatki cykliczne
        </h2>
        <p className="text-muted-foreground">
          Automatyczne generowanie powtarzalnych wydatków, np. abonamentów i
          rachunków.
        </p>
      </div>

      <RecurringManager expenses={expenses} categories={categories} />
    </div>
  );
}
