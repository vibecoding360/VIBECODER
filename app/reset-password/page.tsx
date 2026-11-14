import Link from "next/link";
import { updatePassword } from "./actions";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="text-xl font-semibold">focus<span className="text-[#9cf36b]">flow</span>.</Link>
        <div className="mt-10 rounded-3xl border border-white/10 bg-[#111827]/80 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[.2em] text-[#9cf36b]">Almost there</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Choose a new password.</h1>
          {params.error && <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{params.error}</p>}
          <form action={updatePassword} className="mt-7 space-y-4">
            <label className="block text-sm text-slate-300">New password<input required minLength={8} type="password" name="password" autoComplete="new-password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-[#9cf36b]" placeholder="At least 8 characters" /></label>
            <button className="w-full rounded-xl bg-[#9cf36b] px-4 py-3.5 font-semibold text-[#10170d] hover:bg-[#b4ff8c]">Update password ↗</button>
          </form>
        </div>
      </div>
    </main>
  );
}