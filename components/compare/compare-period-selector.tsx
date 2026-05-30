"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface ComparePeriodSelectorProps {
  period: 1 | 2;
  month: number;
  year: number;
  month1: number;
  year1: number;
  month2: number;
  year2: number;
  title: string;
}

export function ComparePeriodSelector({
  period,
  month,
  year,
  month1,
  year1,
  month2,
  year2,
  title,
}: ComparePeriodSelectorProps) {
  const router = useRouter();
  const label = format(new Date(year, month - 1, 1), "LLLL yyyy", {
    locale: pl,
  });

  function navigate(delta: number) {
    let newMonth = month + delta;
    let newYear = year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    const params = new URLSearchParams();
    if (period === 1) {
      params.set("month1", String(newMonth));
      params.set("year1", String(newYear));
      params.set("month2", String(month2));
      params.set("year2", String(year2));
    } else {
      params.set("month1", String(month1));
      params.set("year1", String(year1));
      params.set("month2", String(newMonth));
      params.set("year2", String(newYear));
    }

    router.push(`/compare?${params.toString()}`);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => navigate(-1)}
          aria-label={`Poprzedni miesiąc (${title})`}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <span className="min-w-36 text-center text-sm font-medium capitalize">
          {label}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => navigate(1)}
          aria-label={`Następny miesiąc (${title})`}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
