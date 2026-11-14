import Link from "next/link";
import { requestPasswordReset } from "./actions";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="text-xl font-semibold">focus<span className="text-[#9cf36b]">flow</span>.</Link>
        <div className="mt-10 rounded-3xl border border-white/10 bg-[#111827]/80 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[.2em] text-[#9cf36b]">Account recovery</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Reset your password.</h1>
          <p className="mt-2 text-sm text-slate-400">We'll email you a secure link to choose a new password.</p>
          {params.error && <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{params.error}</p>}
          {params.message && <p role="status" className="mt-5 rounded-xl border border-[#9cf36b]/20 bg-[#9cf36b]/10 p-3 text-sm text-[#b4ff8c]">{params.message}</p>}
          <form action={requestPasswordReset} className="mt-7 space-y-4">
            <label className="block text-sm text-slate-300">Email<input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-[#9cf36b]" placeholder="you@example.com" /></label>
            <button className="w-full rounded-xl bg-[#9cf36b] px-4 py-3.5 font-semibold text-[#10170d] hover:bg-[#b4ff8c]">Send reset link ↗</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400"><Link href="/login" className="text-[#9cf36b]">Back to sign in</Link></p>
        </div>
      </div>
    </main>
  );
}