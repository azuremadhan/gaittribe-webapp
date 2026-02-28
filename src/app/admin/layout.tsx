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
    <main className="section-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="card h-fit border border-white/[0.06] bg-[#12151c] p-4">
          <p className="px-2 pb-1 text-lg font-bold tracking-tight text-white">GAITTRIB</p>
          <p className="px-2 pb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">Admin Workspace</p>
          <nav className="space-y-1">
            {sections.map((section) => (
              <Link key={section.href} href={section.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.04] hover:text-white">
                {section.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
