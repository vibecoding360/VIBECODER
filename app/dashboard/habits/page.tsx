import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createHabit, toggleHabitToday } from "../actions";

export default async function HabitsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");
  const userId = String(claims.claims.sub);
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: habits }, { data: entries }] = await Promise.all([
    supabase.from("habits").select("id,name,created_at").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("habit_entries").select("habit_id").eq("user_id", userId).eq("completed_on", today)
  ]);
  const done = new Set((entries ?? []).map((entry) => entry.habit_id));
  const list = habits ?? [];
  return <div className="mx-auto max-w-[900px]">
    <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#77966a]">Your workspace / Habits</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-[#1d2b21] sm:text-4xl">Daily habits</h1><p className="mt-2 text-sm text-[#879188]">Consistency is built one check-in at a time.</p></div>
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#e4eadf] bg-[#eff4eb] p-5"><div><p className="text-sm font-semibold text-[#3b5138]">Today's progress</p><p className="mt-1 text-xs text-[#82927d]">You've checked in on {done.size} of {list.length} habits.</p></div><p className="text-2xl font-semibold text-[#638354]">{list.length ? Math.round(done.size / list.length * 100) : 0}<span className="text-sm">%</span></p></div>
    <form action={createHabit} className="flex gap-2 rounded-2xl border border-[#e8ece5] bg-white p-4"><input required maxLength={120} name="name" placeholder="Add a habit (e.g. Read for 20 minutes)" className="min-w-0 flex-1 rounded-xl border border-[#e8ece5] bg-[#fafbf9] px-4 py-3 text-sm text-[#27372b] outline-none placeholder:text-[#a6afa6] focus:border-[#9ab58d]" /><button className="rounded-xl bg-[#789b69] px-5 py-3 text-sm font-semibold text-white hover:bg-[#668957]">Add +</button></form>
    <div className="mt-6 space-y-2">{list.length === 0 && <p className="rounded-2xl border border-dashed border-[#dfe6dc] bg-white/60 p-8 text-center text-sm text-[#929d93]">Start with one small habit you'd like to build.</p>}{list.map((habit) => { const checked = done.has(habit.id); return <form key={habit.id} action={toggleHabitToday.bind(null, habit.id)} className="flex items-center gap-4 rounded-xl border border-[#e8ece5] bg-white p-4"><span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm ${checked ? "bg-[#edf4e8] text-[#6f925f]" : "bg-[#f5f6f3] text-[#a0aaa0]"}`}>{checked ? "✓" : "○"}</span><span className={`flex-1 text-sm font-medium ${checked ? "text-[#9aa49a]" : "text-[#344337]"}`}>{habit.name}</span><button className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${checked ? "bg-[#f3f5f1] text-[#879287]" : "bg-[#edf4e8] text-[#6f925f] hover:bg-[#e3eddb]"}`}>{checked ? "Completed" : "Mark done"}</button></form>; })}</div>
  </div>;
}