import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");
  const email = typeof data.claims.email === "string" ? data.claims.email : "Your account";
  const metadata = data.claims.user_metadata;
  const name = metadata && typeof metadata === "object" && "display_name" in metadata && typeof metadata.display_name === "string" ? metadata.display_name : "there";

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
      <header className="flex items-center justify-between border-b border-white/10 pb-6">
        <Link href="/" className="text-xl font-semibold">focus<span className="text-[#9cf36b]">flow</span>.</Link>
        <form action={logout}><button className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Sign out</button></form>
      </header>
      <section className="py-14">
        <p className="text-xs uppercase tracking-[.2em] text-[#9cf36b]">Your personal workspace</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Good to see you, {name}.</h1>
        <p className="mt-3 text-slate-400">{email} · This is your private FocusFlow dashboard.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[[ "Today's focus", "0 min", "Your focus time starts here." ], [ "Tasks completed", "0 / 0", "Small steps create momentum." ], [ "Current streak", "0 days", "Show up for yourself today." ]].map(([label,value,description]) => <article key={label} className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><p className="text-sm text-slate-400">{label}</p><p className="mt-4 text-4xl font-semibold">{value}</p><p className="mt-2 text-xs text-slate-500">{description}</p></article>)}
        </div>
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[.02] p-8"><h2 className="text-xl font-semibold">Your next chapter starts now.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Your workspace is ready. Task planning, focus sessions, habits, and productivity insights will be added in the next build phase.</p></div>
      </section>
    </main>
  );
}