"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTransactionAction } from "@/actions/transaction.actions";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TYPE_LABELS } from "@/lib/transactions/format";
import type { Category } from "@/lib/types/database.types";
import type { TransactionFilters } from "@/lib/validations/transaction.schema";
import type { TransactionWithCategory } from "@/services/transaction.service";

interface TransactionsManagerProps {
  transactions: TransactionWithCategory[];
  categories: Category[];
  currentFilters: TransactionFilters;
}

export function TransactionsManager({
  transactions,
  categories,
  currentFilters,
}: TransactionsManagerProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionWithCategory | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<TransactionWithCategory | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const hasActiveFilters = Boolean(
    currentFilters.date_from ||
      currentFilters.date_to ||
      currentFilters.category_id ||
      currentFilters.type
  );

  function handleDeleteConfirm() {
    if (!deletingTransaction) return;

    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteTransactionAction(deletingTransaction.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeletingTransaction(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <TransactionFiltersBar
        categories={categories}
        currentFilters={currentFilters}
      />

      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)} disabled={categories.length === 0}>
          Dodaj transakcję
        </Button>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Dodaj co najmniej jedną kategorię, aby móc zapisywać transakcje.
        </p>
      )}

      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? "Brak transakcji spełniających wybrane filtry."
              : "Brak transakcji. Dodaj pierwszą transakcję."}
          </p>
          {!hasActiveFilters && categories.length > 0 && (
            <Button className="mt-4" onClick={() => setCreateOpen(true)}>
              Dodaj transakcję
            </Button>
          )}
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={setEditingTransaction}
          onDelete={(transaction) => {
            setDeleteError(null);
            setDeletingTransaction(transaction);
          }}
        />
      )}

      {createOpen && (
        <TransactionForm
          mode="create"
          categories={categories}
          open={createOpen}
          onOpenChange={setCreateOpen}
        />
      )}

      {editingTransaction && (
        <TransactionForm
          key={editingTransaction.id}
          mode="edit"
          transaction={editingTransaction}
          categories={categories}
          open={Boolean(editingTransaction)}
          onOpenChange={(open) => {
            if (!open) setEditingTransaction(null);
          }}
        />
      )}

      <Dialog
        open={Boolean(deletingTransaction)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTransaction(null);
            setDeleteError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Usuń transakcję</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć transakcję{" "}
              <strong>
                {deletingTransaction?.description ||
                  TYPE_LABELS[deletingTransaction?.type ?? "expense"]}
              </strong>
              ? Tej operacji nie można cofnąć.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
          )}

          <DialogFooter className="px-0 pb-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingTransaction(null)}
              disabled={isDeleting}
            >
              Anuluj
            </Button>
            <Button
              type="button"
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
