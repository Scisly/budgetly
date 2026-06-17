"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBudgetAction } from "@/actions/budget.actions";
import { BudgetCard } from "@/components/budgets/budget-card";
import { BudgetForm } from "@/components/budgets/budget-form";
import { MonthSelector } from "@/components/dashboard/month-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import type { Category } from "@/lib/types/database.types";
import type { BudgetProgress } from "@/services/budget.service";

interface BudgetsManagerProps {
  budgets: BudgetProgress[];
  categories: Category[];
  month: number;
  year: number;
}

export function BudgetsManager({
  budgets,
  categories,
  month,
  year,
}: BudgetsManagerProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetProgress | null>(
    null
  );
  const [deletingBudget, setDeletingBudget] = useState<BudgetProgress | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDeleteConfirm() {
    if (!deletingBudget) return;
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteBudgetAction(deletingBudget.budget.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeletingBudget(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <MonthSelector month={month} year={year} basePath="/budgets" />
        <Button onClick={() => setCreateOpen(true)}>Dodaj budżet</Button>
      </div>

      {budgets.length === 0 ? (
        <EmptyState
          description="Brak budżetów na ten miesiąc. Dodaj pierwszy limit wydatków."
          action={
            <Button onClick={() => setCreateOpen(true)}>Dodaj budżet</Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {budgets.map((item) => (
            <BudgetCard
              key={item.budget.id}
              item={item}
              onEdit={() => setEditingBudget(item)}
              onDelete={() => {
                setDeleteError(null);
                setDeletingBudget(item);
              }}
            />
          ))}
        </div>
      )}

      {createOpen && (
        <BudgetForm
          mode="create"
          categories={categories}
          defaultMonth={month}
          defaultYear={year}
          open={createOpen}
          onOpenChange={setCreateOpen}
        />
      )}

      {editingBudget && (
        <BudgetForm
          key={editingBudget.budget.id}
          mode="edit"
          budget={editingBudget}
          categories={categories}
          defaultMonth={month}
          defaultYear={year}
          open={Boolean(editingBudget)}
          onOpenChange={(open) => !open && setEditingBudget(null)}
        />
      )}

      <AlertDialog
        open={Boolean(deletingBudget)}
        onOpenChange={(open) => !open && setDeletingBudget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń budżet</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć budżet „
              {deletingBudget?.category?.name ?? "Budżet ogólny"}”?
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner data-icon="inline-start" /> : null}
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
