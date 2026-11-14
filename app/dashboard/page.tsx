import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createTask, updateTaskStatus, deleteTask, createHabit, toggleHabitToday, logout } from "./actions";
import { FocusTimer } from "@/components/focus-timer";

function dateLabel() {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: claims, error } = await supabase.auth.getClaims();
  if (error || !claims?.claims) redirect("/login");
  const userId = String(claims.claims.sub);
  const email = typeof claims.claims.email === "string" ? claims.claims.email : "Your account";
  const metadata = claims.claims.user_metadata;
  const name = metadata && typeof metadata === "object" && "display_name" in metadata && typeof metadata.display_name === "string" ? metadata.display_name : "there";

  const [{ data: tasks }, { data: habits }, { data: sessions }, { data: entries }] = await Promise.all([
    supabase.from("tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
    supabase.from("habits").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("focus_sessions").select("duration_seconds,started_at").eq("user_id", userId).gte("started_at", new Date(new Date().setHours(0,0,0,0)).toISOString()),
    supabase.from("habit_entries").select("habit_id").eq("user_id", userId).eq("completed_on", new Date().toISOString().slice(0,10))
  ]);
  const taskList = tasks ?? [];
  const habitList = habits ?? [];
  const completedToday = entries ?? [];
  const completedCount = taskList.filter((task) => task.status === "done").length;
  const focusMinutes = Math.round((sessions ?? []).reduce((sum, session) => sum + session.duration_seconds, 0) / 60);
  const todayHabits = new Set(completedToday.map((entry) => entry.habit_id));

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-5 py-6 sm:px-8">
      <header className="flex items-center justify-between border-b border-white/10 pb-5">
        <Link href="/" className="text-xl font-semibold tracking-tight">focus<span className="text-[#9cf36b]">flow</span>.</Link>
        <div className="flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-medium">{name}</p><p className="text-xs text-slate-500">{email}</p></div><form action={logout}><button className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Sign out</button></form></div>
      </header>
      <section className="py-9"><p className="text-xs uppercase tracking-[.2em] text-[#9cf36b]">Your personal workspace · {dateLabel()}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Good to see you, {name}.</h1><p className="mt-2 text-sm text-slate-400">Make a little progress. Then make a little more.</p></section>
      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {[[ "Focus today", `${focusMinutes} min`, "Time invested in deep work" ], [ "Tasks completed", `${completedCount} / ${taskList.length}`, "Keep moving forward" ], [ "Habits today", `${todayHabits.size} / ${habitList.length}`, "Consistency beats intensity" ]].map(([label,value,description]) => <article key={label} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-500">{description}</p></article>)}
      </section>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-[#111827]/75 p-6">
            <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.18em] text-[#9cf36b]">Your priorities</p><h2 className="mt-2 text-xl font-semibold">Task board</h2></div><span className="text-xs text-slate-500">{taskList.length} tasks</span></div>
            <form action={createTask} className="mt-5 flex flex-col gap-2 sm:flex-row"><input required maxLength={240} name="title" placeholder="What needs your attention?" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#9cf36b]" /><select name="priority" className="rounded-xl border border-white/10 bg-[#111827] px-3 py-3 text-sm text-slate-300"><option value="medium">Medium</option><option value="high">High</option><option value="low">Low</option></select><button className="rounded-xl bg-[#9cf36b] px-5 py-3 text-sm font-semibold text-[#10170d] hover:bg-[#b4ff8c]">+ Add task</button></form>
            <div className="mt-5 space-y-2">
              {taskList.length === 0 && <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">Your task list is clear. Add your first priority above.</p>}
              {taskList.map((task) => <article key={task.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-3"><form action={updateTaskStatus.bind(null, task.id, task.status === "done" ? "todo" : "done")}><button aria-label={task.status === "done" ? "Mark as not done" : "Mark as done"} className={`h-6 w-6 rounded-full border text-xs ${task.status === "done" ? "border-[#9cf36b] bg-[#9cf36b] text-black" : "border-white/25"}`}>{task.status === "done" ? "✓" : ""}</button></form><div className="min-w-0 flex-1"><p className={`truncate text-sm ${task.status === "done" ? "text-slate-500 line-through" : "text-slate-200"}`}>{task.title}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{task.priority} priority · {task.status.replace("_"," ")}</p></div><form action={deleteTask.bind(null, task.id)}><button className="px-2 py-1 text-xs text-slate-500 hover:text-red-300">Delete</button></form></article>)}
            </div>
          </section>
          <section className="rounded-3xl border border-white/10 bg-[#111827]/75 p-6">
            <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.18em] text-[#9cf36b]">Small steps, every day</p><h2 className="mt-2 text-xl font-semibold">Habit tracker</h2></div><span className="text-xs text-slate-500">{todayHabits.size} completed today</span></div>
            <form action={createHabit} className="mt-5 flex gap-2"><input required maxLength={120} name="name" placeholder="Add a habit (e.g. Read 20 minutes)" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#9cf36b]" /><button className="rounded-xl border border-white/15 px-4 py-3 text-sm hover:bg-white/5">Add</button></form>
            <div className="mt-4 space-y-2">{habitList.length === 0 && <p className="py-5 text-center text-sm text-slate-500">Create a small habit you want to keep.</p>}{habitList.map((habit) => { const done = todayHabits.has(habit.id); return <form key={habit.id} action={toggleHabitToday.bind(null, habit.id)} className="flex items-center justify-between rounded-xl border border-white/[.07] p-3"><span className="text-sm text-slate-200">{habit.name}</span><button className={`rounded-full px-3 py-1.5 text-xs ${done ? "bg-[#9cf36b]/15 text-[#9cf36b]" : "border border-white/15 text-slate-400"}`}>{done ? "✓ Done today" : "Mark done"}</button></form>; })}</div>
          </section>
        </div>
        <aside className="space-y-6"><FocusTimer /><section className="rounded-3xl border border-white/10 bg-[#111827]/75 p-6"><p className="text-xs uppercase tracking-[.18em] text-[#9cf36b]">A gentle reminder</p><h2 className="mt-3 text-xl font-semibold">Focus on the next step.</h2><p className="mt-2 text-sm leading-6 text-slate-400">You don't need to finish everything today. Choose one meaningful task, give it your attention, and begin.</p></section></aside>
      </div>
      <footer className="mt-10 border-t border-white/10 py-6 text-center text-xs text-slate-600">FocusFlow · Make time for what matters.</footer>
    </main>
  );
}