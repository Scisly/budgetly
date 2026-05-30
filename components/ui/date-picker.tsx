"use client";

import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatTransactionDate } from "@/lib/transactions/format";
import { cn } from "@/lib/utils";

function parseDateValue(value: string): Date | undefined {
  if (!value) return undefined;
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
}

export interface DatePickerProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  id,
  name,
  value,
  onChange,
  placeholder = "Wybierz datę",
  required,
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {name ? (
        <input type="hidden" name={name} value={value} required={required} />
      ) : null}
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            id={id}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <CalendarIcon className="size-4" data-icon="inline-start" />
        {value ? formatTransactionDate(value) : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }
          }}
          locale={pl}
          defaultMonth={selectedDate}
        />
      </PopoverContent>
    </Popover>
  );
}
