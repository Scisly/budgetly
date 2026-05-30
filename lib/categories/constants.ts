export const CATEGORY_ICONS = [
  "utensils",
  "car",
  "gamepad-2",
  "receipt",
  "heart-pulse",
  "shopping-bag",
  "home",
  "coffee",
  "gift",
  "circle",
] as const;

export type CategoryIconName = (typeof CATEGORY_ICONS)[number];

export const CATEGORY_COLORS = [
  "#ef4444",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
  "#22c55e",
  "#ec4899",
  "#06b6d4",
  "#6366f1",
] as const;
