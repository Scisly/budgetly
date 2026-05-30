"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBudgetAction } from "@/actions/budget.actions";
import { BudgetCard } from "@/components/budgets/budget-card";
import { BudgetForm } from "@/components/budgets/budget-form";
import { MonthSelector } from "@/components/dashboard/month-selector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <p className="text-muted-foreground">
            Brak budżetów na ten miesiąc. Dodaj pierwszy limit wydatków.
          </p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            Dodaj budżet
          </Button>
        </div>
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

      <Dialog
        open={Boolean(deletingBudget)}
        onOpenChange={(open) => !open && setDeletingBudget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń budżet</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć budżet „
              {deletingBudget?.category?.name ?? "Budżet ogólny"}”?
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingBudget(null)}
              disabled={isDeleting}
            >
              Anuluj
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Usuwanie…" : "Usuń"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
