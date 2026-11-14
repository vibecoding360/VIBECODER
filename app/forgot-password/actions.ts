"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/forgot-password?error=Enter%20your%20email");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/reset-password`
  });
  if (error) redirect("/forgot-password?error=" + encodeURIComponent(error.message));
  redirect("/forgot-password?message=If%20an%20account%20exists%2C%20a%20reset%20link%20has%20been%20sent");
}