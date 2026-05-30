"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";
import { seedDefaultCategories } from "@/services/seed.service";
import { mapAuthError } from "@/lib/auth/errors";
import type { AuthActionState } from "@/lib/auth/types";

async function getEmailRedirectTo() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  if (!host) return undefined;
  return `${protocol}://${host}/login`;
}

async function completeRegistration(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<never> {
  try {
    await seedDefaultCategories(supabase, userId);
  } catch (seedError) {
    console.error("Failed to seed default categories:", seedError);
  }
  redirect("/dashboard");
}

async function registerWithAdminApi(
  email: string,
  password: string,
  displayName: string
): Promise<AuthActionState> {
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });

  if (error) {
    if (error.message.includes("already been registered")) {
      return { error: "Konto z tym adresem email już istnieje." };
    }
    return {
      error: mapAuthError(
        error,
        "Nie udało się utworzyć konta. Spróbuj ponownie później."
      ),
    };
  }

  const userId = data.user?.id;
  if (!userId) {
    return { error: "Nie udało się utworzyć konta." };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      message:
        "Konto utworzone. Możesz się teraz zalogować używając email i hasła.",
    };
  }

  return completeRegistration(supabase, userId);
}

export async function loginAction(formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return {
      error: mapAuthError(error, "Nieprawidłowy email lub hasło"),
    };
  }
  redirect("/dashboard");
}

export async function registerAction(
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const useAdminApi =
    process.env.NODE_ENV === "development" &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (useAdminApi) {
    return registerWithAdminApi(
      parsed.data.email,
      parsed.data.password,
      parsed.data.displayName
    );
  }

  const supabase = await createClient();
  const emailRedirectTo = await getEmailRedirectTo();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo,
    },
  });

  if (error) {
    if (
      error.code === "over_email_send_rate_limit" &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return registerWithAdminApi(
        parsed.data.email,
        parsed.data.password,
        parsed.data.displayName
      );
    }

    return {
      error: mapAuthError(
        error,
        "Nie udało się utworzyć konta. Spróbuj ponownie później."
      ),
    };
  }

  if (!data.session) {
    return {
      message:
        "Konto utworzone. Sprawdź skrzynkę email i kliknij link aktywacyjny, aby się zalogować.",
    };
  }

  const userId = data.user?.id;
  if (userId) {
    return completeRegistration(supabase, userId);
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
