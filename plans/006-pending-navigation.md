# Plan 006: Pending navigation feedback

> **Drift check**: `git diff --stat fb58be8..HEAD -- components/dashboard/month-selector.tsx components/compare/compare-period-selector.tsx components/transactions/transaction-filters.tsx`

## Status

- **Priority**: P1 | **Effort**: M | **Risk**: LOW
- **Depends on**: plans/001-shadcn-prerequisites.md
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

Month/period navigation and filter apply use `router.push` with no pending feedback. Controls should disable and show Spinner during navigation.

## Scope

- `components/dashboard/month-selector.tsx`
- `components/compare/compare-period-selector.tsx`
- `components/transactions/transaction-filters.tsx`

## Pattern

```tsx
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";

const [isPending, startTransition] = useTransition();

function navigate(...) {
  startTransition(() => {
    router.push(...);
  });
}

<Button disabled={isPending} ...>
  {isPending ? <Spinner data-icon="inline-start" /> : <ChevronLeftIcon />}
</Button>
```

For transaction filters Apply/Clear buttons: show Spinner with `data-icon` when pending, disable all filter controls while pending.

## Done criteria

- [ ] All three components use useTransition + isPending
- [ ] Buttons disabled during pending
- [ ] Spinner used in pending buttons (not text-only swap)
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
