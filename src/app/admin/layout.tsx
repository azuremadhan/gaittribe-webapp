import Link from "next/link";
import { requireAdmin } from "@/lib/guards";

const sections = [
  { href: "/admin/overview", label: "Overview" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/leaderboard", label: "Leaderboard" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[250px_1fr]">
      <aside className="card h-fit border border-slate-200 p-4">
        <p className="px-2 pb-1 text-lg font-extrabold tracking-[0.12em] text-brand-500">GAITTRIB</p>
        <p className="px-2 pb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted">Admin Workspace</p>
        <nav className="space-y-1">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-brand-500">
              {section.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </main>
  );
}

