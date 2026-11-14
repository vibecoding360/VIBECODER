import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createTask, updateTaskStatus, deleteTask } from "../actions";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");
  const userId = String(claims.claims.sub);
  const { data } = await supabase.from("tasks").select("id,title,status,priority,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
  const tasks = data ?? [];
  const open = tasks.filter((task) => task.status !== "done");
  const done = tasks.filter((task) => task.status === "done");
  return <div className="mx-auto max-w-[900px]">
    <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#77966a]">Your workspace / Tasks</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-[#1d2b21] sm:text-4xl">Task list</h1><p className="mt-2 text-sm text-[#879188]">A clear list. A calmer mind.</p></div>
    <form action={createTask} className="flex flex-col gap-2 rounded-2xl border border-[#e8ece5] bg-white p-4 sm:flex-row"><input required maxLength={240} name="title" placeholder="Add a task you want to finish…" className="min-w-0 flex-1 rounded-xl border border-[#e8ece5] bg-[#fafbf9] px-4 py-3 text-sm text-[#27372b] outline-none placeholder:text-[#a6afa6] focus:border-[#9ab58d]" /><select name="priority" aria-label="Task priority" className="rounded-xl border border-[#e8ece5] bg-white px-3 py-3 text-sm text-[#647166]"><option value="medium">Medium</option><option value="high">High</option><option value="low">Low</option></select><button className="rounded-xl bg-[#789b69] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#668957]">Add task +</button></form>
    <div className="mt-8 flex items-center justify-between"><h2 className="text-sm font-semibold text-[#536154]">To do <span className="ml-2 rounded-full bg-[#edf2e9] px-2 py-1 text-xs text-[#71866a]">{open.length}</span></h2><span className="text-xs text-[#9ba59b]">{done.length} completed</span></div>
    <div className="mt-3 space-y-2">{open.length === 0 && <p className="rounded-2xl border border-dashed border-[#dfe6dc] bg-white/60 p-8 text-center text-sm text-[#929d93]">Nothing pending. Add your next task above.</p>}{open.map((task) => <article key={task.id} className="flex items-center gap-3 rounded-xl border border-[#e8ece5] bg-white p-4"><form action={updateTaskStatus.bind(null, task.id, "done")}><button aria-label="Mark task complete" className="h-5 w-5 rounded-full border border-[#c5d0c2] transition hover:border-[#789b69] hover:bg-[#eff5eb]" /></form><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#344337]">{task.title}</p><p className="mt-1 text-[11px] capitalize text-[#98a298]">{task.priority} priority</p></div><form action={deleteTask.bind(null, task.id)}><button className="rounded-lg px-2 py-1 text-xs text-[#a1aaa1] hover:bg-red-50 hover:text-red-500">Delete</button></form></article>)}</div>
    {done.length > 0 && <details className="mt-7 rounded-2xl border border-[#e8ece5] bg-white p-4"><summary className="cursor-pointer text-sm font-semibold text-[#758176]">Completed tasks ({done.length})</summary><div className="mt-4 space-y-2">{done.map((task) => <article key={task.id} className="flex items-center gap-3 rounded-xl bg-[#f8faf7] p-3"><form action={updateTaskStatus.bind(null, task.id, "todo")}><button aria-label="Reopen task" className="flex h-5 w-5 items-center justify-center rounded-full bg-[#789b69] text-xs text-white">✓</button></form><p className="min-w-0 flex-1 truncate text-sm text-[#9aa49a] line-through">{task.title}</p><form action={deleteTask.bind(null, task.id)}><button className="px-2 text-xs text-[#a1aaa1] hover:text-red-500">Delete</button></form></article>)}</div></details>}
  </div>;
}