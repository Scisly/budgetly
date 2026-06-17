# Plan 004: Shared empty states with shadcn Empty

> **Drift check**: `git diff --stat fb58be8..HEAD -- components/shared/ components/*/ components/charts/`

## Status

- **Priority**: P1 | **Effort**: M | **Risk**: LOW
- **Depends on**: plans/001-shadcn-prerequisites.md
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

Empty data uses inconsistent dashed-border divs. shadcn Empty provides accessible, consistent empty states.

## Current state

Dashed-border empty divs in:
- `components/transactions/transactions-manager.tsx:85`
- `components/budgets/budgets-manager.tsx:67`
- `components/categories/categories-manager.tsx:80`
- `components/recurring/recurring-manager.tsx:89,113`
- `components/charts/category-pie-chart.tsx:40`
- `components/charts/month-comparison-chart.tsx:60`
- `components/compare/compare-difference-table.tsx:48`

Compare page shows duplicate empty when both chart AND table are empty (same message twice).

## Scope

**In scope**:
- `components/shared/empty-state.tsx` (new wrapper using shadcn Empty)
- All files listed above
- `app/(dashboard)/compare/page.tsx` — dedupe: only table shows empty when no categories; chart empty should not duplicate (remove empty from chart when table handles it, OR show empty once at page level)

**Approach for compare dedupe**: When `comparison.categories.length === 0`, show single EmptyState in compare page wrapping chart+table section; make chart and table return null when empty (not their own empty UI) when used on compare page OR only show empty in CompareDifferenceTable and have MonthComparisonChart return null when empty.

Preferred: `MonthComparisonChart` returns `null` when empty; `CompareDifferenceTable` keeps EmptyState. Chart card on compare page still shows title but no duplicate message.

## EmptyState API

```tsx
interface EmptyStateProps {
  title?: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean; // for chart areas (shorter height)
}
```

Use shadcn Empty primitives: Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent.

## Conventions

- `flex flex-col gap-*` not `space-y-*` in new code
- Polish copy preserved from existing messages

## Done criteria

- [ ] `EmptyState` wrapper exists
- [ ] All 7 component locations use EmptyState
- [ ] Compare page has no duplicate empty messages
- [ ] `grep "border-dashed" components/` returns no matches in updated files
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
