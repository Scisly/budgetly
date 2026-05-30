import { createClient } from "@/lib/supabase/server";
import { BASE_CURRENCY, type CurrencyCode } from "@/lib/money/currencies";
import { ExportCsvButton } from "@/components/settings/export-csv-button";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { CurrencySelector } from "@/components/settings/currency-selector";
import { getProfileCurrency } from "@/services/currency.service";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentCurrency: CurrencyCode = user
    ? await getProfileCurrency(supabase, user.id)
    : BASE_CURRENCY;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Ustawienia</h2>
        <p className="text-muted-foreground">
          Zarządzaj wyglądem aplikacji, walutą i eksportem danych.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Wygląd</h3>
          <p className="text-sm text-muted-foreground">
            Dostosuj motyw kolorystyczny aplikacji.
          </p>
        </div>
        <ThemeToggle />
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Waluta</h3>
          <p className="text-sm text-muted-foreground">
            Wybierz walutę, w której mają być wyświetlane kwoty w aplikacji.
          </p>
        </div>
        <CurrencySelector currentCurrency={currentCurrency} />
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Eksport danych</h3>
          <p className="text-sm text-muted-foreground">
            Pobierz wszystkie transakcje jako plik CSV (Excel, Google Sheets).
          </p>
        </div>
        <ExportCsvButton />
      </section>
    </div>
  );
}
