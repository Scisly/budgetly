"use client";

import { useActionState, useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateCurrencyAction,
  type ProfileActionState,
} from "@/actions/profile.actions";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BASE_CURRENCY,
  getCurrencyLabel,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from "@/lib/money/currencies";

interface CurrencySelectorProps {
  currentCurrency: CurrencyCode;
}

const initialState: ProfileActionState = {};

export function CurrencySelector({ currentCurrency }: CurrencySelectorProps) {
  const router = useRouter();
  const [currency, setCurrency] = useState(currentCurrency);

  const boundAction = useCallback(
    async (
      _prevState: ProfileActionState,
      formData: FormData
    ): Promise<ProfileActionState> => updateCurrencyAction(formData),
    []
  );

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    setCurrency(currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    if (state.success) {
      toast.success("Zapisano preferencję waluty.");
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.error, state.success, router]);

  function handleValueChange(value: string | null) {
    if (!value || value === currency) return;

    const nextCurrency = value as CurrencyCode;
    setCurrency(nextCurrency);

    const formData = new FormData();
    formData.set("currency_code", nextCurrency);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="currency_code">Waluta wyświetlania</Label>
        <Select
          value={currency}
          onValueChange={handleValueChange}
          disabled={isPending}
          items={SUPPORTED_CURRENCIES.map((item) => ({
            value: item.code,
            label: item.label,
          }))}
        >
          <SelectTrigger id="currency_code" className="w-full max-w-sm">
            <SelectValue placeholder="Wybierz walutę">
              {(value) => getCurrencyLabel(value as CurrencyCode)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_CURRENCIES.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Kwoty w aplikacji wpisujesz i widzisz w wybranej walucie. W bazie są
          przechowywane w {BASE_CURRENCY} z aktualnym kursem wymiany.
        </p>
      </div>
    </div>
  );
}
