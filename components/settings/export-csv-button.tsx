"use client";

import { useState, useTransition } from "react";
import { DownloadIcon } from "lucide-react";
import { exportTransactionsAction } from "@/actions/export.actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function ExportCsvButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    setError(null);
    startTransition(async () => {
      const result = await exportTransactionsAction();
      if ("error" in result) {
        setError(result.error);
        return;
      }

      const blob = new Blob(["\uFEFF", result.csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleExport}
        disabled={isPending}
      >
        <DownloadIcon className="size-4" />
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        Eksportuj CSV
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
