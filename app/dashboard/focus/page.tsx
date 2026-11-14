import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FocusTimer } from "@/components/focus-timer";

export default async function FocusPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");
  const userId = String(claims.claims.sub);
  const start = new Date(new Date().setHours(0,0,0,0)).toISOString();
  const { data } = await supabase.from("focus_sessions").select("duration_seconds").eq("user_id", userId).gte("started_at", start);
  const minutes = Math.round((data ?? []).reduce((total, session) => total + session.duration_seconds, 0) / 60);
  return <div className="mx-auto max-w-[760px]">
    <div className="mb-8 text-center"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#77966a]">Your workspace / Focus</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-[#1d2b21] sm:text-4xl">Make space to focus.</h1><p className="mt-2 text-sm text-[#879188]">One task. One session. No rush.</p></div>
    <FocusTimer />
    <div className="mt-5 rounded-2xl border border-[#e8ece5] bg-white p-5 text-center"><p className="text-xs font-medium uppercase tracking-wider text-[#97a197]">Your focus time today</p><p className="mt-2 text-2xl font-semibold text-[#344337]">{minutes} <span className="text-sm font-medium text-[#98a198]">minutes</span></p></div>
  </div>;
}