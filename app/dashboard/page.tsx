import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: claims, error } = await supabase.auth.getClaims();
  if (error || !claims?.claims) redirect("/login");
  const userId = String(claims.claims.sub);
  const metadata = claims.claims.user_metadata;
  const name = metadata && typeof metadata === "object" && "display_name" in metadata && typeof metadata.display_name === "string" ? metadata.display_name.split(" ")[0] : "there";
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const today = now.toISOString().slice(0, 10);
  const [{ data: tasks }, { data: habits }, { data: sessions }, { data: entries }] = await Promise.all([
    supabase.from("tasks").select("id,status").eq("user_id", userId).limit(200),
    supabase.from("habits").select("id").eq("user_id", userId),
    supabase.from("focus_sessions").select("duration_seconds").eq("user_id", userId).gte("started_at", start),
    supabase.from("habit_entries").select("habit_id").eq("user_id", userId).eq("completed_on", today)
  ]);
  const taskCount = tasks?.length ?? 0;
  const doneCount = tasks?.filter((task) => task.status === "done").length ?? 0;
  const habitCount = habits?.length ?? 0;
  const habitsDone = entries?.length ?? 0;
  const focusMinutes = Math.round((sessions ?? []).reduce((total, session) => total + session.duration_seconds, 0) / 60);
  const date = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(now);
  const spaces = [
    { href: "/dashboard/tasks", number: "01", title: "Tasks", description: "Keep your priorities clear and move work forward.", action: "Open task list", icon: "☷" },
    { href: "/dashboard/habits", number: "02", title: "Habits", description: "Build small routines and track your daily consistency.", action: "View habits", icon: "◷" },
    { href: "/dashboard/focus", number: "03", title: "Focus", description: "Start a focused session and give one thing your attention.", action: "Start a session", icon: "◎" }
  ];
  return <div>
    <div className="mb-9"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#77966a]">{date}</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] text-[#1d2b21] sm:text-[40px]">Good morning, {name}.</h1><p className="mt-2 text-[15px] text-[#849087]">A little structure can make a big difference.</p></div>
    <section className="grid gap-4 sm:grid-cols-3">
      <article className="rounded-2xl border border-[#e8ece5] bg-white p-5"><p className="text-sm font-medium text-[#879188]">Focus time today</p><p className="mt-4 text-3xl font-semibold tracking-tight text-[#26372a]">{focusMinutes}<span className="ml-1 text-sm font-medium text-[#98a198]">min</span></p><p className="mt-1 text-xs text-[#a0a9a0]">Time spent in sessions</p></article>
      <article className="rounded-2xl border border-[#e8ece5] bg-white p-5"><p className="text-sm font-medium text-[#879188]">Tasks completed</p><p className="mt-4 text-3xl font-semibold tracking-tight text-[#26372a]">{doneCount}<span className="ml-1 text-sm font-medium text-[#98a198]">/ {taskCount}</span></p><p className="mt-1 text-xs text-[#a0a9a0]">Your progress so far</p></article>
      <article className="rounded-2xl border border-[#e8ece5] bg-white p-5"><p className="text-sm font-medium text-[#879188]">Habits checked in</p><p className="mt-4 text-3xl font-semibold tracking-tight text-[#26372a]">{habitsDone}<span className="ml-1 text-sm font-medium text-[#98a198]">/ {habitCount}</span></p><p className="mt-1 text-xs text-[#a0a9a0]">Completed today</p></article>
    </section>
    <section className="mt-11"><div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#8a9b83]">Your spaces</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-[#27372b]">What would you like to work on?</h2></div>
      <div className="grid gap-4 md:grid-cols-3">{spaces.map((space) => <Link key={space.href} href={space.href} className="group rounded-2xl border border-[#e8ece5] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#cbd9c3] hover:shadow-[0_14px_40px_rgba(37,58,39,.07)]"><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1f5ed] text-xl text-[#6f8e62]">{space.icon}</span><span className="text-xs font-semibold tracking-widest text-[#b3bcb2]">{space.number}</span></div><h3 className="mt-7 text-lg font-semibold text-[#2a392d]">{space.title}</h3><p className="mt-2 min-h-[48px] text-sm leading-6 text-[#879188]">{space.description}</p><p className="mt-6 text-sm font-semibold text-[#6d8d60]">{space.action} <span className="inline-block transition group-hover:translate-x-1">→</span></p></Link>)}</div>
    </section>
    <p className="mt-10 text-center text-xs text-[#a3aca3]">Keep it simple. One thing at a time.</p>
  </div>;
}