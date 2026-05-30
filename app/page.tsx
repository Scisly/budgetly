import Link from "next/link";
import {
  BarChart3Icon,
  PiggyBankIcon,
  WalletIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: WalletIcon,
    title: "Pełna kontrola wydatków",
    description:
      "Rejestruj wydatki i przychody, filtruj transakcje i analizuj swoje finanse w jednym miejscu.",
  },
  {
    icon: PiggyBankIcon,
    title: "Budżety z alertami",
    description:
      "Ustaw limity miesięczne per kategoria i otrzymuj ostrzeżenia, gdy zbliżasz się do progu.",
  },
  {
    icon: BarChart3Icon,
    title: "Analiza i automatyzacja",
    description:
      "Wydatki cykliczne, porównanie miesięcy i eksport CSV — mniej pracy, więcej wglądu.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <span className="text-lg font-semibold tracking-tight">Budgetly</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Zaloguj się
            </Button>
            <Button
              size="sm"
              render={<Link href="/register" />}
              nativeButton={false}
            >
              Załóż konto
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center md:px-6 md:py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Dziennik wydatków osobistych
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Budgetly — kontroluj swoje wydatki
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Prosta aplikacja do śledzenia finansów, budżetów i trendów.
              Zacznij od darmowego konta i miej pełny obraz swoich pieniędzy.
            </p>
          </div>

          <div
            className="flex animate-fade-up flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "80ms" }}
          >
            <Button
              size="lg"
              render={<Link href="/register" />}
              nativeButton={false}
            >
              Rozpocznij za darmo
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Mam już konto
            </Button>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30 py-16 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <div className="mb-10 animate-fade-up text-center">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Wszystko, czego potrzebujesz
              </h2>
              <p className="mt-2 text-muted-foreground">
                Od codziennego wpisywania wydatków po analizę trendów.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="interactive-card animate-fade-up border-border/80 bg-card"
                    style={{ animationDelay: `${120 + index * 80}ms` }}
                  >
                    <CardHeader>
                      <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 text-center md:px-6 md:py-20">
          <div className="animate-scale-in">
            <h2 className="text-2xl font-semibold tracking-tight">
              Gotowy, by przejąć kontrolę?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
              Dołącz do Budgetly i zacznij świadomie zarządzać swoim budżetem już
              dziś.
            </p>
            <Button
              className="mt-6"
              size="lg"
              render={<Link href="/register" />}
              nativeButton={false}
            >
              Utwórz konto
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Budgetly — projekt zaliczeniowy WSB
      </footer>
    </div>
  );
}
