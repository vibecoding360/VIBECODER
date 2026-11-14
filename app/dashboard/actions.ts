"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const priority = String(formData.get("priority") ?? "medium");
  if (!title || title.length > 240 || !["low","medium","high"].includes(priority)) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("tasks").insert({ user_id: user.id, title, priority });
  revalidatePath("/dashboard");
}

export async function updateTaskStatus(id: string, status: "todo" | "in_progress" | "done") {
  if (!id || !["todo","in_progress","done"].includes(status)) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("tasks").update({ status, completed_at: status === "done" ? new Date().toISOString() : null }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  if (!id) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function createHabit(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length > 120) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("habits").insert({ user_id: user.id, name });
  revalidatePath("/dashboard");
}

export async function toggleHabitToday(habitId: string) {
  if (!habitId) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const today = new Date().toISOString().slice(0,10);
  const { data: existing } = await supabase.from("habit_entries").select("id").eq("habit_id", habitId).eq("user_id", user.id).eq("completed_on", today).maybeSingle();
  if (existing) {
    await supabase.from("habit_entries").delete().eq("id", existing.id).eq("user_id", user.id);
  } else {
    await supabase.from("habit_entries").insert({ habit_id: habitId, user_id: user.id, completed_on: today });
  }
  revalidatePath("/dashboard");
}

export async function saveFocusSession(durationSeconds: number) {
  const duration = Math.floor(Number(durationSeconds));
  if (!Number.isFinite(duration) || duration < 1 || duration > 7200) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const endedAt = new Date();
  const startedAt = new Date(endedAt.getTime() - duration * 1000);
  await supabase.from("focus_sessions").insert({
    user_id: user.id,
    started_at: startedAt.toISOString(),
    ended_at: endedAt.toISOString(),
    duration_seconds: duration,
    completed: true
  });
  revalidatePath("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}