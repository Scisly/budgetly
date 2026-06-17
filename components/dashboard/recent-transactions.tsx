"use client";

import Link from "next/link";
import { CategoryIcon } from "@/components/categories/category-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/components/providers/currency-provider";
import { resolveAmountBase } from "@/lib/money/transaction-amounts";
import {
  formatTransactionDate,
  TYPE_LABELS,
} from "@/lib/transactions/format";
import type { TransactionWithCategory } from "@/services/transaction.service";

interface RecentTransactionsProps {
  transactions: TransactionWithCategory[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { formatAmount } = useCurrency();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Ostatnie transakcje</CardTitle>
        <Link href="/transactions" className="text-sm text-primary hover:underline">
          Wszystkie
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Brak transakcji w tym miesiącu.{" "}
            <Link href="/transactions" className="text-primary hover:underline">
              Dodaj pierwszą
            </Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {tx.category && (
                      <Badge variant="outline" className="gap-1 font-normal">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: tx.category.color }}
                        />
                        <CategoryIcon name={tx.category.icon} className="size-3" />
                        {tx.category.name}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatTransactionDate(tx.transaction_date)}
                    </span>
                  </div>
                  <p className="truncate text-sm">
                    {tx.description || TYPE_LABELS[tx.type]}
                  </p>
                </div>
                <span
                  className={
                    tx.type === "expense"
                      ? "shrink-0 font-medium text-destructive"
                      : "shrink-0 font-medium text-success"
                  }
                >
                  {tx.type === "expense" ? "−" : "+"}
                  {formatAmount(resolveAmountBase(tx))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
