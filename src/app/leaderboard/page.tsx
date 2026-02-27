import Link from "next/link";
import { Trophy, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { getMostConsistentUsers } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GlobalLeaderboardPage() {
  const [topEntries, consistency] = await Promise.all([
    prisma.leaderboard.findMany({
      orderBy: [{ score: "desc" }, { rank: "asc" }],
      take: 30,
      include: { user: true, event: true },
    }),
    getMostConsistentUsers(5),
  ]);

  const topThree = topEntries.slice(0, 3);
  const rest = topEntries.slice(3);

  return (
    <main className="section-shell">
      <Section title="GAITTRIB LEADERBOARD" subtitle="Global performance rankings across all listed events.">
        <div className="grid gap-4 md:grid-cols-3">
          {topThree.map((entry, idx) => (
            <article key={entry.id} className="card border border-slate-200 p-6">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted">
                <Trophy size={14} /> Top {idx + 1}
              </p>
              <p className="mt-3 text-xl font-extrabold text-ink">{entry.user.name || entry.user.email}</p>
              <p className="mt-1 text-sm text-muted">{entry.score} pts � {entry.event.title}</p>
            </article>
          ))}
        </div>

        <div className="card mt-6 overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-muted">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Athlete</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((entry, idx) => (
                  <tr key={entry.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">#{idx + 4}</td>
                    <td className="px-4 py-3">{entry.user.name || entry.user.email}</td>
                    <td className="px-4 py-3">{entry.event.title}</td>
                    <td className="px-4 py-3">{entry.score}</td>
                  </tr>
                ))}
                {!topEntries.length && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">No leaderboard entries yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge variant="open" className="text-[11px]">Most Consistent</Badge>
          {consistency[0] ? (
            <p className="inline-flex items-center gap-2 text-sm text-slate-700">
              <TrendingUp size={14} /> {consistency[0].name || consistency[0].email} ({consistency[0].attendanceCount} events)
            </p>
          ) : (
            <p className="text-sm text-muted">Consistency data will appear after confirmed participation.</p>
          )}
          <Link href="/community" className="ml-auto text-sm font-semibold text-brand-500 hover:underline">Visit Community</Link>
        </div>
      </Section>
    </main>
  );
}
