import { createClient } from "@/lib/supabase/server";
import { getDisplayCurrencyContext } from "@/services/currency.service";
import { BottomNav } from "@/components/layout/bottom-nav";
import { DashboardPageTransition } from "@/components/layout/dashboard-page-transition";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { CurrencyProvider } from "@/components/providers/currency-provider";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currencyContext = await getDisplayCurrencyContext(
    supabase,
    user?.id ?? null
  );

  return (
    <CurrencyProvider
      currencyCode={currencyContext.currencyCode}
      rate={currencyContext.rate}
    >
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">
            <DashboardPageTransition>{children}</DashboardPageTransition>
          </main>
        </div>

        <BottomNav />
      </div>
    </CurrencyProvider>
  );
}
