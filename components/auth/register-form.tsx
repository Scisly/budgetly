"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthActionState } from "@/lib/auth/types";

async function registerFormAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  return (await registerAction(formData)) ?? null;
}

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerFormAction,
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utwórz konto</CardTitle>
        <CardDescription>
          Zarejestruj się, aby zacząć śledzić wydatki.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Imię</Label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
          {state?.message && (
            <p className="text-sm text-green-600 dark:text-green-400" role="status">
              {state.message}
            </p>
          )}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Rejestracja…" : "Zarejestruj"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Masz już konto?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Zaloguj się
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
