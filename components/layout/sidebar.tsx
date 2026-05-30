"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition } from "react";
import { allNavItems, isNavItemActive } from "@/lib/navigation";
import { playClickSound, playNavigateSound } from "@/lib/ui-sounds";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <ViewTransition name="persistent-sidebar" default="none">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar md:flex md:flex-col">
        <div className="border-b border-sidebar-border px-4 py-4">
          <Link
            href="/dashboard"
            onClick={() => playNavigateSound()}
            className="text-lg font-semibold tracking-tight transition-opacity duration-150 hover:opacity-80"
          >
            Budgetly
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {allNavItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  playClickSound();
                  if (!active) playNavigateSound();
                }}
                className={cn(
                  "interactive-link flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-[background-color,color,transform] duration-150 active:scale-[0.98]",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </ViewTransition>
  );
}
