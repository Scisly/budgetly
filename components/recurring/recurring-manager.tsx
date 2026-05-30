"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  deleteRecurringAction,
  toggleRecurringActiveAction,
} from "@/actions/recurring.actions";
import { CategoryIcon } from "@/components/categories/category-icon";
import { RecurringForm } from "@/components/recurring/recurring-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FREQUENCY_LABELS } from "@/lib/recurring/labels";
import { useCurrency } from "@/components/providers/currency-provider";
import { formatTransactionDate } from "@/lib/transactions/format";
import type { Category } from "@/lib/types/database.types";
import type { RecurringExpenseWithCategory } from "@/services/recurring.service";

interface RecurringManagerProps {
  expenses: RecurringExpenseWithCategory[];
  categories: Category[];
}

export function RecurringManager({
  expenses,
  categories,
}: RecurringManagerProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<RecurringExpenseWithCategory | null>(null);
  const [deletingExpense, setDeletingExpense] =
    useState<RecurringExpenseWithCategory | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function handleDeleteConfirm() {
    if (!deletingExpense) return;
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteRecurringAction(deletingExpense.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeletingExpense(null);
      router.refresh();
    });
  }

  async function handleToggleActive(
    expense: RecurringExpenseWithCategory,
    checked: boolean
  ) {
    setToggleError(null);
    setTogglingId(expense.id);
    const result = await toggleRecurringActiveAction(expense.id, checked);
    setTogglingId(null);
    if (result.error) {
      setToggleError(result.error);
      return;
    }
    router.refresh();
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
        <p className="text-muted-foreground">
          Najpierw dodaj kategorię, aby utworzyć wydatek cykliczny.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Aktywne wydatki generują transakcje automatycznie przy logowaniu.
        </p>
        <Button onClick={() => setCreateOpen(true)}>Dodaj cykliczny</Button>
      </div>

      {toggleError && (
        <p className="text-sm text-destructive" role="alert">
          {toggleError}
        </p>
      )}

      {expenses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <p className="text-muted-foreground">
            Brak wydatków cyklicznych. Dodaj pierwszy, np. abonament lub czynsz.
          </p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            Dodaj cykliczny
          </Button>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <div className="rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opis</TableHead>
                    <TableHead>Kategoria</TableHead>
                    <TableHead>Kwota</TableHead>
                    <TableHead>Częstotliwość</TableHead>
                    <TableHead>Następne</TableHead>
                    <TableHead>Aktywny</TableHead>
                    <TableHead className="w-[100px]">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <RecurringTableRow
                      key={expense.id}
                      expense={expense}
                      togglingId={togglingId}
                      onToggle={handleToggleActive}
                      onEdit={() => setEditingExpense(expense)}
                      onDelete={() => {
                        setDeleteError(null);
                        setDeletingExpense(expense);
                      }}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="grid gap-3 md:hidden">
            {expenses.map((expense) => (
              <RecurringMobileCard
                key={expense.id}
                expense={expense}
                togglingId={togglingId}
                onToggle={handleToggleActive}
                onEdit={() => setEditingExpense(expense)}
                onDelete={() => {
                  setDeleteError(null);
                  setDeletingExpense(expense);
                }}
              />
            ))}
          </div>
        </>
      )}

      {createOpen && (
        <RecurringForm
          mode="create"
          categories={categories}
          open={createOpen}
          onOpenChange={setCreateOpen}
        />
      )}

      {editingExpense && (
        <RecurringForm
          key={editingExpense.id}
          mode="edit"
          expense={editingExpense}
          categories={categories}
          open={Boolean(editingExpense)}
          onOpenChange={(open) => !open && setEditingExpense(null)}
        />
      )}

      <Dialog
        open={Boolean(deletingExpense)}
        onOpenChange={(open) => !open && setDeletingExpense(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń wydatek cykliczny</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć „
              {deletingExpense?.description || "ten wydatek"}”? Istniejące
              transakcje pozostaną bez zmian.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingExpense(null)}
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

function RecurringCategoryCell({
  expense,
}: {
  expense: RecurringExpenseWithCategory;
}) {
  if (!expense.category) return <>—</>;

  return (
    <div className="flex items-center gap-2">
      <span
        className="flex size-7 items-center justify-center rounded-md bg-muted"
        style={{ color: expense.category.color }}
      >
        <CategoryIcon name={expense.category.icon} className="size-3.5" />
      </span>
      <span>{expense.category.name}</span>
    </div>
  );
}

function RecurringActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onEdit}
        aria-label="Edytuj"
      >
        <PencilIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onDelete}
        aria-label="Usuń"
      >
        <Trash2Icon className="size-4 text-destructive" />
      </Button>
    </div>
  );
}

function RecurringTableRow({
  expense,
  togglingId,
  onToggle,
  onEdit,
  onDelete,
}: {
  expense: RecurringExpenseWithCategory;
  togglingId: string | null;
  onToggle: (expense: RecurringExpenseWithCategory, checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { formatAmount } = useCurrency();

  return (
    <TableRow className={!expense.is_active ? "opacity-60" : undefined}>
      <TableCell className="font-medium">{expense.description || "—"}</TableCell>
      <TableCell>
        <RecurringCategoryCell expense={expense} />
      </TableCell>
      <TableCell>{formatAmount(Number(expense.amount))}</TableCell>
      <TableCell>
        <Badge variant="secondary">{FREQUENCY_LABELS[expense.frequency]}</Badge>
      </TableCell>
      <TableCell>{formatTransactionDate(expense.next_occurrence)}</TableCell>
      <TableCell>
        <Switch
          checked={expense.is_active}
          disabled={togglingId === expense.id}
          onCheckedChange={(checked) => onToggle(expense, checked)}
          aria-label={`Aktywny: ${expense.description || "wydatek cykliczny"}`}
        />
      </TableCell>
      <TableCell>
        <RecurringActions onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}

function RecurringMobileCard({
  expense,
  togglingId,
  onToggle,
  onEdit,
  onDelete,
}: {
  expense: RecurringExpenseWithCategory;
  togglingId: string | null;
  onToggle: (expense: RecurringExpenseWithCategory, checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { formatAmount } = useCurrency();

  return (
    <Card className={!expense.is_active ? "opacity-60" : undefined}>
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="font-medium">{expense.description || "Bez opisu"}</p>
            <p className="text-sm text-muted-foreground">
              Następne: {formatTransactionDate(expense.next_occurrence)}
            </p>
          </div>
          <p className="font-medium">{formatAmount(Number(expense.amount))}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <RecurringCategoryCell expense={expense} />
          <Badge variant="secondary">
            {FREQUENCY_LABELS[expense.frequency]}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Aktywny</span>
            <Switch
              checked={expense.is_active}
              disabled={togglingId === expense.id}
              onCheckedChange={(checked) => onToggle(expense, checked)}
              aria-label={`Aktywny: ${expense.description || "wydatek cykliczny"}`}
            />
          </div>
          <RecurringActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      </CardContent>
    </Card>
  );
}
