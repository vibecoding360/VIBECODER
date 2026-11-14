"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { saveFocusSession } from "@/app/dashboard/actions";
const PRESETS = [25, 50, 5];
export function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [pending, startTransition] = useTransition();
  const completionSaved = useRef(false);
  const isComplete = remaining === 0;
  useEffect(() => {
    if (!running || isComplete) return;
    const timer = window.setInterval(() => setRemaining((current) => {
      if (current <= 1) { window.clearInterval(timer); return 0; }
      return current - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running, isComplete]);
  useEffect(() => {
    if (isComplete && running && minutes !== 5 && !completionSaved.current) {
      completionSaved.current = true;
      startTransition(() => { void saveFocusSession(minutes * 60); });
    }
  }, [isComplete, running, minutes]);
  const reset = (nextMinutes = minutes) => { completionSaved.current = false; setRunning(false); setMinutes(nextMinutes); setRemaining(nextMinutes * 60); };
  const toggle = () => {
    if (remaining === 0) { completionSaved.current = false; setRemaining(minutes * 60); setRunning(true); return; }
    setRunning((value) => !value);
  };
  const active = running && !isComplete;
  const display = `${String(Math.floor(remaining / 60)).padStart(2,"0")}:${String(remaining % 60).padStart(2,"0")}`;
  const progress = ((minutes * 60 - remaining) / (minutes * 60)) * 100;
  return <section className="rounded-3xl border border-[#e7ece3] bg-white p-7 shadow-[0_12px_40px_rgba(37,58,39,.045)] sm:p-9">
    <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#829b77]">Focus session</p><h2 className="mt-2 text-lg font-semibold text-[#344337]">Stay with one thing.</h2></div><span className="rounded-full bg-[#f2f5ef] px-3 py-1.5 text-xs font-medium text-[#7d897b]">{active ? "● In session" : remaining === 0 ? "Session complete" : "Ready when you are"}</span></div>
    <div className="my-9 flex justify-center"><div className="relative flex h-60 w-60 items-center justify-center rounded-full" style={{background:`conic-gradient(#86a978 ${progress}%, #edf1e9 0)`}}><div className="flex h-[218px] w-[218px] flex-col items-center justify-center rounded-full bg-white"><span className="text-6xl font-light tracking-[-.06em] tabular-nums text-[#26372a]">{display}</span><span className="mt-2 text-[10px] font-semibold uppercase tracking-[.2em] text-[#9ba69a]">{active ? "Stay focused" : isComplete ? "Well done" : "Deep work"}</span></div></div></div>
    <div className="flex justify-center gap-2">{PRESETS.map((value) => <button key={value} onClick={() => reset(value)} className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${minutes === value ? "bg-[#789b69] text-white" : "border border-[#e8ece5] text-[#7b887c] hover:bg-[#f5f7f3]"}`}>{value === 5 ? "Short break" : `${value} min`}</button>)}</div>
    <div className="mx-auto mt-6 flex max-w-[360px] gap-3"><button onClick={toggle} disabled={pending} className="flex-1 rounded-xl bg-[#789b69] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#668957] disabled:opacity-60">{active ? "Pause session" : remaining === 0 ? "Start again" : "Start focus"}</button><button onClick={() => reset()} className="rounded-xl border border-[#e8ece5] px-5 py-3.5 text-sm font-semibold text-[#788579] transition hover:bg-[#f6f8f4]">Reset</button></div>
    {pending && <p className="mt-3 text-center text-xs text-[#98a398]">Saving your completed session…</p>}
  </section>;
}