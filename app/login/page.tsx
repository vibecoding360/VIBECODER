import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="text-xl font-semibold">focus<span className="text-[#9cf36b]">flow</span>.</Link>
        <div className="mt-10 rounded-3xl border border-white/10 bg-[#111827]/80 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[.2em] text-[#9cf36b]">Welcome back</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign in to your flow.</h1>
          <p className="mt-2 text-sm text-slate-400">Pick up where you left off.</p>
          {params.error && <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{params.error}</p>}
          <form action={login} className="mt-7 space-y-4">
            <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
            <label className="block text-sm text-slate-300">Email<input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-[#9cf36b]" placeholder="you@example.com" /></label>
            <label className="block text-sm text-slate-300">Password<input required type="password" name="password" autoComplete="current-password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-[#9cf36b]" placeholder="Your password" /></label>
            <button className="w-full rounded-xl bg-[#9cf36b] px-4 py-3.5 font-semibold text-[#10170d] hover:bg-[#b4ff8c]">Sign in ↗</button>
          </form>
          <div className="mt-6 flex justify-between text-sm text-slate-400"><Link href="/signup" className="hover:text-[#9cf36b]">Create account</Link><Link href="/forgot-password" className="hover:text-[#9cf36b]">Forgot password?</Link></div>
        </div>
      </div>
    </main>
  );
}