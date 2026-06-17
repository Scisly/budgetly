"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface MonthSelectorProps {
  month: number;
  year: number;
  basePath?: string;
}

export function MonthSelector({
  month,
  year,
  basePath = "/dashboard",
}: MonthSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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

    startTransition(() => {
      router.push(`${basePath}?month=${newMonth}&year=${newYear}`);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => navigate(-1)}
        disabled={isPending}
        aria-label="Poprzedni miesiąc"
      >
        {isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <ChevronLeftIcon className="size-4" />
        )}
      </Button>
      <span className="min-w-36 text-center text-sm font-medium capitalize">
        {label}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => navigate(1)}
        disabled={isPending}
        aria-label="Następny miesiąc"
      >
        {isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <ChevronRightIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
