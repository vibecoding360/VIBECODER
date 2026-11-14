import Link from "next/link";
import { logout } from "./actions";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: "⌂" },
  { href: "/dashboard/tasks", label: "Tasks", icon: "☷" },
  { href: "/dashboard/habits", label: "Habits", icon: "◷" },
  { href: "/dashboard/focus", label: "Focus", icon: "◎" }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f7f4] text-[#18231d]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-[#e7eae4] bg-white px-5 py-7 lg:flex">
        <Link href="/" className="mb-12 px-3 text-[22px] font-bold tracking-[-.06em] text-[#17231b]">focus<span className="text-[#6d9d4c]">flow</span><span className="text-[#6d9d4c]">.</span></Link>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#9aa49b]">Workspace</p>
        <nav className="space-y-1">
          {navigation.map((item) => <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-medium text-[#68746b] transition hover:bg-[#f2f6ee] hover:text-[#263b2b]"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f3f5f1] text-base text-[#6e8b65] group-hover:bg-white">{item.icon}</span>{item.label}</Link>)}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#f3f6ef] p-4"><p className="text-sm font-semibold text-[#30432f]">Make room for focus.</p><p className="mt-1 text-xs leading-5 text-[#7c897b]">Small, steady steps make meaningful progress.</p></div>
        <form action={logout} className="mt-5"><button className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#7b857c] transition hover:bg-[#f7f7f5] hover:text-[#27352a]">↪ &nbsp; Sign out</button></form>
      </aside>
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-[#e7eae4] bg-white/90 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
            <Link href="/" className="text-lg font-bold tracking-[-.06em] lg:hidden">focus<span className="text-[#6d9d4c]">flow</span>.</Link>
            <p className="hidden text-sm font-medium text-[#778178] lg:block">Your personal workspace</p>
            <nav aria-label="Main navigation" className="flex items-center gap-1 overflow-x-auto lg:hidden">{navigation.map((item) => <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-[#667268] transition hover:bg-[#f2f6ee] hover:text-[#273b2b]">{item.label}</Link>)}</nav>
            <span className="hidden rounded-full border border-[#e8ece5] px-3 py-1.5 text-xs font-medium text-[#7c887e] sm:inline-flex">Personal space</span>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-65px)] max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}