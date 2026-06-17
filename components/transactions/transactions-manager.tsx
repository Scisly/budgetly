"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTransactionAction } from "@/actions/transaction.actions";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
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
        <EmptyState
          description={
            hasActiveFilters
              ? "Brak transakcji spełniających wybrane filtry."
              : "Brak transakcji. Dodaj pierwszą transakcję."
          }
          action={
            !hasActiveFilters && categories.length > 0 ? (
              <Button onClick={() => setCreateOpen(true)}>Dodaj transakcję</Button>
            ) : undefined
          }
        />
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

      <AlertDialog
        open={Boolean(deletingTransaction)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTransaction(null);
            setDeleteError(null);
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń transakcję</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć transakcję{" "}
              <strong>
                {deletingTransaction?.description ||
                  TYPE_LABELS[deletingTransaction?.type ?? "expense"]}
              </strong>
              ? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
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
