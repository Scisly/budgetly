"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import {
  createRecurringAction,
  updateRecurringAction,
  type RecurringActionState,
} from "@/actions/recurring.actions";
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
import { format } from "date-fns";
import { FREQUENCY_LABELS } from "@/lib/recurring/labels";
import type { Category, FrequencyType } from "@/lib/types/database.types";
import type { RecurringExpenseWithCategory } from "@/services/recurring.service";
import { useSuccessSound } from "@/hooks/use-success-sound";
import { useCurrencyAmountInput } from "@/hooks/use-currency-amount-input";
import { CurrencyAmountField } from "@/components/forms/currency-amount-field";

interface RecurringFormProps {
  mode: "create" | "edit";
  expense?: RecurringExpenseWithCategory;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialActionState: RecurringActionState = {};

export function RecurringForm({
  mode,
  expense,
  categories,
  open,
  onOpenChange,
}: RecurringFormProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string>(
    expense?.category_id ?? categories[0]?.id ?? ""
  );
  const [frequency, setFrequency] = useState<FrequencyType>(
    expense?.frequency ?? "monthly"
  );
  const [nextOccurrence, setNextOccurrence] = useState(
    expense?.next_occurrence ?? format(new Date(), "yyyy-MM-dd")
  );
  const {
    amount,
    setAmount,
    currencyCode,
    applyAmountToFormData,
  } = useCurrencyAmountInput(expense?.amount);

  async function boundAction(
    _prevState: RecurringActionState,
    formData: FormData
  ): Promise<RecurringActionState> {
    formData.set("category_id", categoryId);
    formData.set("frequency", frequency);
    applyAmountToFormData(formData);
    if (mode === "create") return createRecurringAction(formData);
    if (!expense?.id) return { error: "Brak identyfikatora wydatku cyklicznego." };
    return updateRecurringAction(expense.id, formData);
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
    mode === "create" ? "Dodaj wydatek cykliczny" : "Edytuj wydatek cykliczny";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Transakcje będą generowane automatycznie w dniu następnego
            wystąpienia.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_id">Kategoria</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value ?? "")}
              items={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            >
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CurrencyAmountField
            id="amount"
            label="Kwota"
            amount={amount}
            onAmountChange={setAmount}
            currencyCode={currencyCode}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="description">Opis</Label>
            <Input
              id="description"
              name="description"
              maxLength={200}
              defaultValue={expense?.description ?? ""}
              placeholder="np. Netflix, czynsz"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Częstotliwość</Label>
            <Select
              value={frequency}
              onValueChange={(value) =>
                setFrequency((value as FrequencyType) ?? "monthly")
              }
              items={(Object.keys(FREQUENCY_LABELS) as FrequencyType[]).map(
                (key) => ({
                  value: key,
                  label: FREQUENCY_LABELS[key],
                })
              )}
            >
              <SelectTrigger id="frequency" className="w-full">
                <SelectValue placeholder="Wybierz częstotliwość" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(FREQUENCY_LABELS) as FrequencyType[]).map(
                  (key) => (
                    <SelectItem key={key} value={key}>
                      {FREQUENCY_LABELS[key]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_occurrence">Następne wystąpienie</Label>
            <DatePicker
              id="next_occurrence"
              name="next_occurrence"
              value={nextOccurrence}
              onChange={setNextOccurrence}
              required
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              {mode === "create" ? "Dodaj" : "Zapisz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
