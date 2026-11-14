"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!name || !email || password.length < 8) redirect("/signup?error=Enter%20your%20name%2C%20valid%20email%2C%20and%20a%20password%20of%208%2B%20characters");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/dashboard`
    }
  });
  if (error) redirect("/signup?error=" + encodeURIComponent(error.message));
  if (data.session) redirect("/dashboard");
  redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account");
}