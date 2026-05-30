"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import {
  createBudgetAction,
  updateBudgetAction,
  type BudgetActionState,
} from "@/actions/budget.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/lib/types/database.types";
import type { BudgetProgress } from "@/services/budget.service";
import { useSuccessSound } from "@/hooks/use-success-sound";
import { useCurrencyAmountInput } from "@/hooks/use-currency-amount-input";
import { CurrencyAmountField } from "@/components/forms/currency-amount-field";

interface BudgetFormProps {
  mode: "create" | "edit";
  budget?: BudgetProgress;
  categories: Category[];
  defaultMonth: number;
  defaultYear: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialActionState: BudgetActionState = {};

export function BudgetForm({
  mode,
  budget,
  categories,
  defaultMonth,
  defaultYear,
  open,
  onOpenChange,
}: BudgetFormProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string>(
    budget?.budget.category_id ?? "general"
  );
  const {
    amount,
    setAmount,
    currencyCode,
    applyAmountToFormData,
  } = useCurrencyAmountInput(budget?.limit);

  async function boundAction(
    _prevState: BudgetActionState,
    formData: FormData
  ): Promise<BudgetActionState> {
    formData.set("category_id", categoryId);
    applyAmountToFormData(formData, "limit_amount");
    if (mode === "create") return createBudgetAction(formData);
    if (!budget?.budget.id) return { error: "Brak identyfikatora budżetu." };
    return updateBudgetAction(budget.budget.id, formData);
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

  const title = mode === "create" ? "Dodaj budżet" : "Edytuj budżet";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Ustaw limit wydatków na wybrany miesiąc. Kategoria opcjonalna —
            puste pole oznacza budżet ogólny.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_id">Kategoria</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value ?? "general")}
              items={[
                { value: "general", label: "Budżet ogólny (wszystkie)" },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                })),
              ]}
            >
              <SelectTrigger id="category_id" className="w-full">
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Budżet ogólny (wszystkie)</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CurrencyAmountField
            id="limit_amount"
            label="Limit"
            amount={amount}
            onAmountChange={setAmount}
            currencyCode={currencyCode}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="month">Miesiąc</Label>
              <Input
                id="month"
                name="month"
                type="number"
                min={1}
                max={12}
                required
                defaultValue={budget?.budget.month ?? defaultMonth}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Rok</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min={2020}
                required
                defaultValue={budget?.budget.year ?? defaultYear}
              />
            </div>
          </div>

          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? "Zapisywanie…" : mode === "create" ? "Dodaj" : "Zapisz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
