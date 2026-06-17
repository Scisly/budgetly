"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import {
  createTransactionAction,
  updateTransactionAction,
  type TransactionActionState,
} from "@/actions/transaction.actions";
import { CategoryIcon } from "@/components/categories/category-icon";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuccessSound } from "@/hooks/use-success-sound";
import { CurrencyAmountField } from "@/components/forms/currency-amount-field";
import { TYPE_LABELS } from "@/lib/transactions/format";
import {
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from "@/lib/money/currencies";
import { useCurrency } from "@/components/providers/currency-provider";
import type { Category } from "@/lib/types/database.types";
import type { TransactionWithCategory } from "@/services/transaction.service";

interface TransactionFormProps {
  mode: "create" | "edit";
  transaction?: TransactionWithCategory;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialActionState: TransactionActionState = {};

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm({
  mode,
  transaction,
  categories,
  open,
  onOpenChange,
}: TransactionFormProps) {
  const router = useRouter();
  const { currencyCode: profileCurrency } = useCurrency();
  const defaultCategoryId = transaction?.category_id ?? categories[0]?.id ?? "";
  const defaultType = transaction?.type ?? "expense";
  const defaultDate =
    transaction?.transaction_date ?? getTodayDateString();

  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [type, setType] = useState<"expense" | "income">(defaultType);
  const [transactionDate, setTransactionDate] = useState(defaultDate);
  const [transactionCurrency, setTransactionCurrency] = useState<CurrencyCode>(
    (transaction?.currency_code as CurrencyCode) ?? profileCurrency
  );
  const [amount, setAmount] = useState(
    transaction?.amount != null && transaction.amount > 0
      ? String(transaction.amount)
      : ""
  );

  async function boundAction(
    _prevState: TransactionActionState,
    formData: FormData
  ): Promise<TransactionActionState> {
    formData.set("category_id", categoryId);
    formData.set("currency_code", transactionCurrency);
    const parsedAmount = amount.replace(",", ".");
    if (parsedAmount) {
      formData.set("amount", parsedAmount);
    }

    if (mode === "create") {
      return createTransactionAction(formData);
    }
    if (!transaction?.id) {
      return { error: "Brak identyfikatora transakcji." };
    }
    return updateTransactionAction(transaction.id, formData);
  }

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialActionState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onOpenChange(false);
    }
  }, [state.success, router, onOpenChange]);

  useSuccessSound(state.success);

  const title =
    mode === "create" ? "Dodaj transakcję" : "Edytuj transakcję";
  const description =
    mode === "create"
      ? "Zapisz nowy wydatek lub przychód w wybranej kategorii."
      : "Zaktualizuj kwotę, datę, kategorię lub opis transakcji.";
  const submitLabel = mode === "create" ? "Dodaj" : "Zapisz";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="transaction-category">Kategoria</Label>
            <input type="hidden" name="category_id" value={categoryId} />
            <Select
              value={categoryId}
              onValueChange={(value) => {
                if (value) setCategoryId(value);
              }}
              items={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              required
            >
              <SelectTrigger id="transaction-category" className="w-full">
                <SelectValue placeholder="Wybierz kategorię">
                  {(value) => {
                    const category = categories.find((item) => item.id === value);
                    if (!category) return null;

                    return (
                      <span className="flex items-center gap-2">
                        <span style={{ color: category.color }}>
                          <CategoryIcon name={category.icon} />
                        </span>
                        {category.name}
                      </span>
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span style={{ color: category.color }}>
                        <CategoryIcon name={category.icon} />
                      </span>
                      {category.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CurrencyAmountField
            id="transaction-amount"
            label="Kwota"
            amount={amount}
            onAmountChange={setAmount}
            currencyCode={transactionCurrency}
            required
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="transaction-currency">Waluta</Label>
            <input type="hidden" name="currency_code" value={transactionCurrency} />
            <Select
              value={transactionCurrency}
              onValueChange={(value) => {
                if (value) setTransactionCurrency(value as CurrencyCode);
              }}
              items={SUPPORTED_CURRENCIES.map((currency) => ({
                value: currency.code,
                label: currency.label,
              }))}
            >
              <SelectTrigger id="transaction-currency" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="transaction-date">Data</Label>
            <DatePicker
              id="transaction-date"
              name="transaction_date"
              value={transactionDate}
              onChange={setTransactionDate}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="transaction-type">Typ</Label>
            <input type="hidden" name="type" value={type} />
            <Select
              value={type}
              onValueChange={(value) => {
                if (value === "expense" || value === "income") {
                  setType(value);
                }
              }}
              items={[
                { value: "expense", label: TYPE_LABELS.expense },
                { value: "income", label: TYPE_LABELS.income },
              ]}
            >
              <SelectTrigger id="transaction-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">{TYPE_LABELS.expense}</SelectItem>
                <SelectItem value="income">{TYPE_LABELS.income}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="transaction-description">Opis (opcjonalnie)</Label>
            <Input
              id="transaction-description"
              name="description"
              defaultValue={transaction?.description ?? ""}
              placeholder="np. Zakupy w markecie"
              maxLength={200}
              autoComplete="off"
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <DialogFooter className="px-0 pb-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isPending || !categoryId || !amount}>
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
