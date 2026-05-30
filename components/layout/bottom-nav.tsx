"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ViewTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  primaryNavItems,
  secondaryNavItems,
  isNavItemActive,
} from "@/lib/navigation";
import { playClickSound, playNavigateSound } from "@/lib/ui-sounds";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function handleNavClick(active: boolean) {
  playClickSound();
  if (!active) playNavigateSound();
}

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const isMoreActive = secondaryNavItems.some((item) =>
    isNavItemActive(pathname, item.href)
  );

  return (
    <ViewTransition name="persistent-bottom-nav" default="none">
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
        aria-label="Nawigacja główna"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {primaryNavItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => handleNavClick(active)}
                  className={cn(
                    "interactive-link flex flex-col items-center gap-1 px-2 py-2.5 text-[10px] font-medium transition-[color,transform] duration-150 active:scale-95",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}

          <li>
            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => playClickSound()}
                    className={cn(
                      "h-auto w-full flex-col gap-1 rounded-none px-2 py-2.5 text-[10px] font-medium transition-[color,transform] duration-150 active:scale-95",
                      isMoreActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  />
                }
              >
                <MoreHorizontal className="size-5" aria-hidden />
                <span>Więcej</span>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>Więcej opcji</SheetTitle>
                  <SheetDescription>
                    Cykliczne wydatki, porównanie i ustawienia.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 grid gap-1 pb-4">
                  {secondaryNavItems.map((item) => {
                    const active = isNavItemActive(pathname, item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          handleNavClick(active);
                          setMoreOpen(false);
                        }}
                        className={cn(
                          "interactive-link flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-[background-color,color,transform] duration-150 active:scale-[0.99]",
                          active
                            ? "bg-accent font-medium text-accent-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </li>
        </ul>
      </nav>
    </ViewTransition>
  );
}
