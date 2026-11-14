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

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (remaining === 0 && running && minutes !== 5 && !completionSaved.current) {
      completionSaved.current = true;
      startTransition(() => { void saveFocusSession(minutes * 60); });
    }
  }, [remaining, running, minutes]);

  const reset = (nextMinutes = minutes) => {
    completionSaved.current = false;
    setRunning(false);
    setMinutes(nextMinutes);
    setRemaining(nextMinutes * 60);
  };
  const toggle = () => {
    if (remaining === 0) {
      completionSaved.current = false;
      setRemaining(minutes * 60);
      setRunning(true);
      return;
    }
    setRunning((value) => !value);
  };
  const active = running && remaining > 0;
  const display = `${String(Math.floor(remaining / 60)).padStart(2,"0")}:${String(remaining % 60).padStart(2,"0")}`;
  const progress = ((minutes * 60 - remaining) / (minutes * 60)) * 100;

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827]/75 p-6 sm:p-7">
      <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.18em] text-[#9cf36b]">Focus room</p><h2 className="mt-2 text-xl font-semibold">Time to do great work.</h2></div><span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">{active ? "● In session" : remaining === 0 ? "Session complete" : "Ready when you are"}</span></div>
      <div className="my-7 flex justify-center"><div className="relative flex h-52 w-52 items-center justify-center rounded-full" style={{background:`conic-gradient(#9cf36b ${progress}%, rgba(255,255,255,.08) 0)`}}><div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-[#111827]"><span className="text-5xl font-light tracking-tighter tabular-nums">{display}</span><span className="mt-2 text-[10px] uppercase tracking-[.22em] text-slate-500">{active ? "Stay focused" : "Deep work"}</span></div></div></div>
      <div className="flex justify-center gap-2">{PRESETS.map((value) => <button key={value} onClick={() => reset(value)} className={`rounded-full px-4 py-2 text-xs ${minutes === value ? "bg-[#9cf36b] font-semibold text-[#10170d]" : "border border-white/10 text-slate-400 hover:bg-white/5"}`}>{value === 5 ? "Short break" : `${value} min`}</button>)}</div>
      <div className="mt-5 flex gap-3"><button onClick={toggle} disabled={pending} className="flex-1 rounded-xl bg-[#9cf36b] px-4 py-3 font-semibold text-[#10170d] hover:bg-[#b4ff8c]">{active ? "Pause session" : remaining === 0 ? "Start again" : "Start focus"}</button><button onClick={() => reset()} className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5">Reset</button></div>
      {pending && <p className="mt-3 text-center text-xs text-slate-500">Saving your completed session…</p>}
    </section>
  );
}