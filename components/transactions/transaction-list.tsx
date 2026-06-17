"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { CategoryIcon } from "@/components/categories/category-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrency } from "@/components/providers/currency-provider";
import {
  formatTransactionDate,
  TYPE_LABELS,
} from "@/lib/transactions/format";
import type { TransactionWithCategory } from "@/services/transaction.service";

interface TransactionListProps {
  transactions: TransactionWithCategory[];
  onEdit: (transaction: TransactionWithCategory) => void;
  onDelete: (transaction: TransactionWithCategory) => void;
}

function CategoryBadge({
  category,
}: {
  category: TransactionWithCategory["category"];
}) {
  if (!category) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: category.color }}
        aria-hidden
      />
      <span style={{ color: category.color }}>
        <CategoryIcon name={category.icon} className="size-3" />
      </span>
      {category.name}
    </Badge>
  );
}

function AmountCell({ transaction }: { transaction: TransactionWithCategory }) {
  const { formatAmount } = useCurrency();
  const isExpense = transaction.type === "expense";
  return (
    <span
      className={
        isExpense
          ? "font-medium text-destructive"
          : "font-medium text-success"
      }
    >
      {isExpense ? "-" : "+"}
      {formatAmount(Number(transaction.amount))}
    </span>
  );
}

function TransactionActions({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: TransactionWithCategory;
  onEdit: (transaction: TransactionWithCategory) => void;
  onDelete: (transaction: TransactionWithCategory) => void;
}) {
  const label = transaction.description || TYPE_LABELS[transaction.type];

  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onEdit(transaction)}
        aria-label={`Edytuj transakcję ${label}`}
      >
        <PencilIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(transaction)}
        aria-label={`Usuń transakcję ${label}`}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  return (
    <>
      <div className="hidden md:block">
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Opis</TableHead>
                <TableHead>Kategoria</TableHead>
                <TableHead>Kwota</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead className="w-[140px] text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatTransactionDate(transaction.transaction_date)}
                  </TableCell>
                  <TableCell className="max-w-[240px] truncate">
                    {transaction.description || "—"}
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={transaction.category} />
                  </TableCell>
                  <TableCell>
                    <AmountCell transaction={transaction} />
                  </TableCell>
                  <TableCell>{TYPE_LABELS[transaction.type]}</TableCell>
                  <TableCell className="text-right">
                    <TransactionActions
                      transaction={transaction}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {formatTransactionDate(transaction.transaction_date)}
                  </p>
                  <p className="font-medium">
                    {transaction.description || "Bez opisu"}
                  </p>
                </div>
                <AmountCell transaction={transaction} />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={transaction.category} />
                <Badge variant="secondary">{TYPE_LABELS[transaction.type]}</Badge>
              </div>

              <div className="flex justify-end">
                <TransactionActions
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
