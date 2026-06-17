"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import {
  createCategoryAction,
  updateCategoryAction,
  type CategoryActionState,
} from "@/actions/category.actions";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/categories/constants";
import { useSuccessSound } from "@/hooks/use-success-sound";
import type { Category } from "@/lib/types/database.types";

interface CategoryFormProps {
  mode: "create" | "edit";
  category?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialActionState: CategoryActionState = {};

export function CategoryForm({
  mode,
  category,
  open,
  onOpenChange,
}: CategoryFormProps) {
  const router = useRouter();
  const defaultColor = category?.color ?? CATEGORY_COLORS[0];
  const defaultIcon = category?.icon ?? CATEGORY_ICONS[0];

  const [color, setColor] = useState(defaultColor);
  const [icon, setIcon] = useState<string>(defaultIcon);

  async function boundAction(
    _prevState: CategoryActionState,
    formData: FormData
  ): Promise<CategoryActionState> {
    if (mode === "create") {
      return createCategoryAction(formData);
    }
    if (!category?.id) {
      return { error: "Brak identyfikatora kategorii." };
    }
    return updateCategoryAction(category.id, formData);
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

  function handleColorTextChange(value: string) {
    setColor(value);
  }

  function handleColorPickerChange(value: string) {
    setColor(value);
  }

  const title = mode === "create" ? "Dodaj kategorię" : "Edytuj kategorię";
  const description =
    mode === "create"
      ? "Utwórz nową kategorię wydatków z własną ikoną i kolorem."
      : "Zaktualizuj nazwę, kolor lub ikonę kategorii.";
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
            <Label htmlFor="category-name">Nazwa</Label>
            <Input
              id="category-name"
              name="name"
              defaultValue={category?.name ?? ""}
              placeholder="np. Jedzenie"
              required
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-color-text">Kolor</Label>
            <div className="flex items-center gap-2">
              <input
                id="category-color-picker"
                type="color"
                value={color}
                onChange={(event) => handleColorPickerChange(event.target.value)}
                className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
                aria-label="Wybierz kolor"
              />
              <Input
                id="category-color-text"
                name="color"
                value={color}
                onChange={(event) => handleColorTextChange(event.target.value)}
                placeholder="#RRGGBB"
                pattern="^#[0-9A-Fa-f]{6}$"
                required
                className="font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-icon">Ikona</Label>
            <input type="hidden" name="icon" value={icon} />
            <Select
              value={icon}
              onValueChange={(value) => {
                if (value) setIcon(value);
              }}
            >
              <SelectTrigger id="category-icon" className="w-full">
                <SelectValue placeholder="Wybierz ikonę">
                  <span className="flex items-center gap-2">
                    <CategoryIcon name={icon} />
                    {icon}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ICONS.map((iconName) => (
                  <SelectItem key={iconName} value={iconName}>
                    <CategoryIcon name={iconName} />
                    {iconName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="w-full text-xs text-muted-foreground">
              Szybki wybór koloru
            </span>
            {CATEGORY_COLORS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                className="size-7 rounded-full border border-border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ backgroundColor: preset }}
                aria-label={`Kolor ${preset}`}
              />
            ))}
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
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
