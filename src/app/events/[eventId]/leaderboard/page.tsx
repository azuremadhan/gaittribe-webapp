import type { Metadata } from "next";
import { ShareButton } from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import { getMostConsistentUsers } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: { eventId: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await prisma.event.findUnique({ where: { id: params.eventId }, select: { title: true } });
  const title = event ? `${event.title} | GAITTRIB LEADERBOARD` : "GAITTRIB LEADERBOARD";
  const description = "Live ranks, top performers, and consistency stats on GAITTRIB.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const medalStyles = [
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-slate-100 text-slate-700 border-slate-200",
  "bg-orange-100 text-orange-700 border-orange-200",
];

export default async function EventLeaderboardPage({ params }: PageProps) {
  const [event, rankings, mostConsistent] = await Promise.all([
    prisma.event.findUnique({ where: { id: params.eventId } }),
    prisma.leaderboard.findMany({
      where: { eventId: params.eventId },
      orderBy: { rank: "asc" },
      include: { user: true },
    }),
    getMostConsistentUsers(),
  ]);

  if (!event) return <main className="section-shell py-12">Event not found.</main>;

  const topThree = rankings.slice(0, 3);
  const remaining = rankings.slice(3);
  const topConsistent = mostConsistent[0];

  return (
    <main className="section-shell py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">{event.title} LEADERBOARD</h1>
          <p className="text-sm text-slate-500">Top performers and consistency rankings.</p>
        </div>
        <ShareButton title={`${event.title} | GAITTRIB LEADERBOARD`} />
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {topThree.map((entry, index) => (
          <article key={entry.id} className={`card border p-5 ${medalStyles[index]}`}>
            <p className="text-xs font-bold uppercase tracking-wide">Top {index + 1}</p>
            <p className="mt-2 text-xl font-black">{entry.user.name || entry.user.email}</p>
            <p className="text-sm">Score: {entry.score}</p>
          </article>
        ))}
      </section>

      {topConsistent && (
        <section className="mt-6">
          <Badge className="text-[11px]" variant="open">
            MOST CONSISTENT PLAYER: {topConsistent.name || topConsistent.email}
          </Badge>
        </section>
      )}

      <section className="card mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[560px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {remaining.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">#{entry.rank}</td>
                  <td className="px-4 py-3">{entry.user.name || entry.user.email}</td>
                  <td className="px-4 py-3">{entry.score}</td>
                </tr>
              ))}
              {!rankings.length && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">No results yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

