"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Coś poszło nie tak</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Nie udało się załadować strony</AlertTitle>
            <AlertDescription>
              Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub wróć do
              pulpitu.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button type="button" onClick={reset}>
            Spróbuj ponownie
          </Button>
          <Button
            type="button"
            variant="outline"
            render={<Link href="/dashboard" />}
            nativeButton={false}
          >
            Przejdź do pulpitu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
