"use client";

import { useRef, useState, useTransition } from "react";
import { UploadIcon } from "lucide-react";
import { importTransactionsAction } from "@/actions/import.actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const MAX_FILE_SIZE = 1_000_000;

export function ImportCsvButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSummary(null);
    setRowErrors([]);

    if (file.size > MAX_FILE_SIZE) {
      setError("Plik CSV jest za duży (maks. 1 MB).");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await importTransactionsAction(formData);
      event.target.value = "";

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setSummary(
        `Zaimportowano ${result.imported} transakcji. ${result.errors.length} błędów.`
      );

      const messages = result.errors.map(
        (rowError) => `Wiersz ${rowError.line}: ${rowError.message}`
      );
      setRowErrors(messages);
    });
  }

  const visibleErrors = rowErrors.slice(0, 5);
  const hiddenErrorCount = rowErrors.length - visibleErrors.length;

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
      >
        <UploadIcon className="size-4" />
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        Importuj CSV
      </Button>
      {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
      {visibleErrors.length > 0 && (
        <ul className="text-sm text-destructive" role="alert">
          {visibleErrors.map((message) => (
            <li key={message}>{message}</li>
          ))}
          {hiddenErrorCount > 0 && (
            <li>i {hiddenErrorCount} więcej</li>
          )}
        </ul>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
