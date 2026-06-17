# Implementation Plans

Generated on 2026-06-17. Execute in the order below unless dependencies say otherwise. Each executor: read the plan fully before starting, honor its STOP conditions, and update your row when done.

## Execution order & status

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| 001 | Add shadcn UI prerequisites | P1 | S | — | DONE |
| 002 | Mount Toaster in root layout | P1 | S | 001 | DONE |
| 003 | Add dashboard loading skeletons | P1 | M | 001 | DONE |
| 004 | Shared empty states | P1 | M | 001 | DONE |
| 005 | Unify page animations | P1 | S | — | DONE |
| 006 | Pending navigation feedback | P1 | M | 001 | DONE |
| 007 | Semantic success/warning CSS tokens | P1 | S | — | DONE |
| 008 | Dashboard error.tsx boundary | P1 | S | 007 | DONE |
| 009 | AlertDialog for destructive confirms | P1 | M | 001 | DONE |
| 010 | Spinner on pending form buttons | P1 | S | 001 | DONE |
| 011 | Progress component in budget-card | P1 | S | 007 | DONE |

Status values: TODO | IN PROGRESS | DONE | BLOCKED | REJECTED

## Dependency notes

- 002, 003, 004, 006 require 001 because they depend on shadcn components (skeleton, empty, spinner).
- 005 is independent and can run in parallel with others, but we execute after 001 for consistency.
- 008 and 011 require 007 for semantic color tokens.
- 009 and 010 require 001 (spinner, alert-dialog).

## Findings considered and rejected

- Full `space-y` mechanical pass across entire repo: deferred — low ROI for this phase.
- Suspense splits on dashboard layout recurring processing: deferred — separate perf work.
- FieldGroup/Field form migration: deferred — larger refactor.
- Sound settings UI: out of scope per product decision.
