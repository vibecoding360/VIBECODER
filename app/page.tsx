import Link from "next/link";

const features = [
  ["01", "Plan with clarity", "Turn the noise of a busy day into a short, intentional plan."],
  ["02", "Protect your focus", "Make room for deep work with focused sessions and fewer distractions."],
  ["03", "See your progress", "Build consistency with simple insights into how you spend your time."]
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6">
      <header className="flex h-20 items-center justify-between border-b border-white/10">
        <Link href="/" className="text-xl font-semibold tracking-tight">focus<span className="text-[#9cf36b]">flow</span><span className="ml-1 text-[#9cf36b]">.</span></Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="rounded-full px-4 py-2 text-slate-300 hover:text-white">Log in</Link>
          <Link href="/signup" className="rounded-full bg-[#9cf36b] px-5 py-2.5 font-semibold text-[#10170d] transition hover:bg-[#b4ff8c]">Get started ↗</Link>
        </nav>
      </header>

      <section className="grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-[#9cf36b] shadow-[0_0_12px_#9cf36b]" /> YOUR TIME. YOUR TERMS.
          </div>
          <h1 className="max-w-3xl text-6xl font-semibold leading-[1.04] tracking-[-.06em] sm:text-7xl lg:text-8xl">Make time for <span className="text-[#9cf36b]">what matters.</span></h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">A calmer way to plan your day, protect your focus, and make meaningful progress — one session at a time.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/signup" className="rounded-full bg-[#9cf36b] px-7 py-4 text-sm font-bold text-[#10170d] hover:bg-[#b4ff8c]">Start your flow ↗</Link>
            <Link href="/login" className="rounded-full border border-white/15 px-7 py-4 text-sm font-medium text-white hover:bg-white/5">I have an account</Link>
          </div>
          <p className="mt-6 text-xs text-slate-500">Free to get started · Built for intentional days</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-[#9cf36b]/[.06] blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-[#111827]/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between">
              <div><p className="text-xs uppercase tracking-[.2em] text-slate-500">Your focus today</p><h2 className="mt-2 text-2xl font-semibold">A little progress adds up.</h2></div>
              <span className="rounded-full bg-[#9cf36b]/10 px-3 py-1.5 text-xs text-[#9cf36b]">● Live preview</span>
            </div>
            <div className="my-9 flex items-center justify-center">
              <div className="flex h-56 w-56 flex-col items-center justify-center rounded-full border-[10px] border-[#9cf36b]/20 outline outline-1 outline-[#9cf36b]/30">
                <span className="text-6xl font-light tracking-tighter">25<span className="text-3xl text-slate-500">:00</span></span>
                <span className="mt-2 text-xs uppercase tracking-[.22em] text-slate-500">Deep focus</span>
              </div>
            </div>
            <div className="space-y-3">
              {["Review today's priorities", "One focused work session", "Take a mindful break"].map((item, i) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.03] p-4"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${i === 0 ? "bg-[#9cf36b] text-black" : "border border-white/20 text-slate-500"}`}>{i === 0 ? "✓" : i + 1}</span><span className={i === 0 ? "text-slate-500 line-through" : "text-slate-200"}>{item}</span></div>)}
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-slate-500"><span>YOUR DAILY MOMENTUM</span><span className="text-[#9cf36b]">1 of 3 complete</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/3 rounded-full bg-[#9cf36b]" /></div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 border-t border-white/10 py-12 md:grid-cols-3">
        {features.map(([number, title, description]) => <div key={number} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-6"><span className="text-xs text-[#9cf36b]">{number} / FOCUSFLOW</span><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{description}</p></div>)}
      </section>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-white/10 py-7 text-xs text-slate-500"><span>© {new Date().getFullYear()} FocusFlow</span><span>Make today count.</span></footer>
    </main>
  );
}