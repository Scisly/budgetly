"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TYPE_LABELS } from "@/lib/transactions/format";
import type { Category } from "@/lib/types/database.types";
import type { TransactionFilters } from "@/lib/validations/transaction.schema";

interface TransactionFiltersProps {
  categories: Category[];
  currentFilters: TransactionFilters;
}

export function TransactionFiltersBar({
  categories,
  currentFilters,
}: TransactionFiltersProps) {
  const router = useRouter();
  const [dateFrom, setDateFrom] = useState(currentFilters.date_from ?? "");
  const [dateTo, setDateTo] = useState(currentFilters.date_to ?? "");
  const [categoryId, setCategoryId] = useState(currentFilters.category_id ?? "");
  const [type, setType] = useState(currentFilters.type ?? "");

  function handleApply() {
    const params = new URLSearchParams();

    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    if (categoryId) params.set("category_id", categoryId);
    if (type) params.set("type", type);

    const query = params.toString();
    router.push(query ? `/transactions?${query}` : "/transactions");
  }

  function handleClear() {
    setDateFrom("");
    setDateTo("");
    setCategoryId("");
    setType("");
    router.push("/transactions");
  }

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-date-from">Data od</Label>
          <DatePicker
            id="filter-date-from"
            value={dateFrom}
            onChange={setDateFrom}
            placeholder="Od"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-date-to">Data do</Label>
          <DatePicker
            id="filter-date-to"
            value={dateTo}
            onChange={setDateTo}
            placeholder="Do"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-category">Kategoria</Label>
          <Select
            value={categoryId || "all"}
            onValueChange={(value) =>
              setCategoryId(!value || value === "all" ? "" : value)
            }
            items={[
              { value: "all", label: "Wszystkie" },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          >
            <SelectTrigger id="filter-category" className="w-full">
              <SelectValue placeholder="Wszystkie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-type">Typ</Label>
          <Select
            value={type || "all"}
            onValueChange={(value) =>
              setType(
                !value || value === "all" ? "" : (value as "expense" | "income")
              )
            }
            items={[
              { value: "all", label: "Wszystkie" },
              { value: "expense", label: TYPE_LABELS.expense },
              { value: "income", label: TYPE_LABELS.income },
            ]}
          >
            <SelectTrigger id="filter-type" className="w-full">
              <SelectValue placeholder="Wszystkie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="expense">{TYPE_LABELS.expense}</SelectItem>
              <SelectItem value="income">{TYPE_LABELS.income}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={handleApply}>
          Filtruj
        </Button>
        <Button type="button" variant="outline" onClick={handleClear}>
          Wyczyść
        </Button>
      </div>
    </div>
  );
}
