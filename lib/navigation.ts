import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  BarChart2,
  LayoutDashboard,
  Repeat,
  Settings,
  Tags,
  Wallet,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNavItems: NavItem[] = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/transactions", label: "Transakcje", icon: ArrowLeftRight },
  { href: "/categories", label: "Kategorie", icon: Tags },
  { href: "/budgets", label: "Budżety", icon: Wallet },
];

export const secondaryNavItems: NavItem[] = [
  { href: "/recurring", label: "Cykliczne", icon: Repeat },
  { href: "/compare", label: "Porównanie", icon: BarChart2 },
  { href: "/settings", label: "Ustawienia", icon: Settings },
];

export const allNavItems: NavItem[] = [
  ...primaryNavItems,
  ...secondaryNavItems,
];

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
