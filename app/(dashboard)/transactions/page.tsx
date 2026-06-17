import { createClient } from "@/lib/supabase/server";
import { transactionFiltersSchema } from "@/lib/validations/transaction.schema";
import { getCategories } from "@/services/category.service";
import { getTransactions } from "@/services/transaction.service";
import { TransactionsManager } from "@/components/transactions/transactions-manager";

interface TransactionsPageProps {
  searchParams: Promise<{
    date_from?: string;
    date_to?: string;
    category_id?: string;
    type?: string;
  }>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const params = await searchParams;
  const parsedFilters = transactionFiltersSchema.safeParse({
    date_from: params.date_from,
    date_to: params.date_to,
    category_id: params.category_id,
    type: params.type,
  });
  const filters = parsedFilters.success ? parsedFilters.data : {};

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categories = user ? await getCategories(supabase, user.id) : [];
  const transactions = user
    ? await getTransactions(supabase, user.id, filters)
    : [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Transakcje</h2>
        <p className="text-muted-foreground">
          Przeglądaj, filtruj i zarządzaj wydatkami oraz przychodami w jednym
          miejscu.
        </p>
      </div>

      <TransactionsManager
        transactions={transactions}
        categories={categories}
        currentFilters={filters}
      />
    </div>
  );
}
