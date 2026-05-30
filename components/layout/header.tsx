import { ViewTransition } from "react";
import { logoutAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <ViewTransition name="persistent-header" default="none">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
        <h1 className="text-lg font-semibold md:hidden">Budgetly</h1>
        <div className="hidden flex-1 md:block" />
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm">
            Wyloguj
          </Button>
        </form>
      </header>
    </ViewTransition>
  );
}
