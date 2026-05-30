"use client";

import {
  Car,
  Circle,
  Coffee,
  Gamepad2,
  Gift,
  HeartPulse,
  Home,
  Receipt,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/categories/constants";

const ICON_MAP: Record<(typeof CATEGORY_ICONS)[number], LucideIcon> = {
  utensils: Utensils,
  car: Car,
  "gamepad-2": Gamepad2,
  receipt: Receipt,
  "heart-pulse": HeartPulse,
  "shopping-bag": ShoppingBag,
  home: Home,
  coffee: Coffee,
  gift: Gift,
  circle: Circle,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const Icon =
    name in ICON_MAP
      ? ICON_MAP[name as keyof typeof ICON_MAP]
      : Circle;
  return <Icon className={cn("size-4 shrink-0", className)} aria-hidden />;
}
