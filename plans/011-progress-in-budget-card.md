# Plan 011: Use Progress component in budget-card

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step.
>
> **Drift check (run first)**: `git diff --stat fb58be8..HEAD -- components/budgets/budget-card.tsx`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 007
- **Category**: dx
- **Planned at**: commit `fb58be8`, 2026-06-17

## Why this matters

Budget cards use a hand-rolled progress div. The shadcn Progress component (`components/ui/progress.tsx`) already exists and should be reused for accessibility and consistency.

## Current state

- `components/budgets/budget-card.tsx` lines 86-91: custom `div` progress bar
- `components/ui/progress.tsx` exports Progress, ProgressTrack, ProgressIndicator
- Plan 007 adds semantic `bg-success` / `bg-warning` tokens for status colors

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Lint | `npm run lint` | exit 0 |
| Test | `npm run test` | all pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `components/budgets/budget-card.tsx`

**Out of scope**: other progress UIs

## Steps

### Step 1: Replace custom bar with Progress

Import Progress, ProgressTrack, ProgressIndicator from `@/components/ui/progress`.
Replace the custom div bar with:
```tsx
<Progress value={Math.min(item.percentage, 100)} className="gap-0">
  <ProgressTrack className="h-2">
    <ProgressIndicator className={styles.progress} />
  </ProgressTrack>
</Progress>
```

**Verify**: `rg "overflow-hidden rounded-full bg-muted" components/budgets/budget-card.tsx` → no match

### Step 2: Full verification

**Verify**: `npm run lint && npm run test && npm run build` → all exit 0

## Done criteria

- [ ] budget-card uses shadcn Progress
- [ ] Semantic status colors preserved
- [ ] `npm run lint`, `npm run test`, `npm run build` exit 0
- [ ] `plans/README.md` row 011 → DONE

## STOP conditions

- Progress component API differs from plan
- Verification fails twice
