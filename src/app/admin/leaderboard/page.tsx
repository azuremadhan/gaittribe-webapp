import { addLeaderboardResultAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLeaderboardPage() {
  const [events, confirmedRegistrations, latestEntries] = await Promise.all([
    prisma.event.findMany({ orderBy: { date: "desc" } }),
    prisma.registration.findMany({
      where: { status: "CONFIRMED" },
      include: { user: true, event: true },
      orderBy: { paidAt: "desc" },
      take: 100,
    }),
    prisma.leaderboard.findMany({
      orderBy: [{ eventId: "desc" }, { rank: "asc" }],
      take: 20,
      include: { user: true, event: true },
    }),
  ]);

  return (
    <section>
      <h1 className="text-3xl font-black">Leaderboard</h1>

      <article className="card mt-6 p-6">
        <h2 className="text-xl font-bold">Add Result</h2>
        <form action={addLeaderboardResultAction} className="mt-4 grid gap-3">
          <select name="eventId" required className="rounded-xl border border-slate-200 px-3 py-2">
            <option value="">Select event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
          <select name="userId" required className="rounded-xl border border-slate-200 px-3 py-2">
            <option value="">Select confirmed participant</option>
            {confirmedRegistrations.map((registration) => (
              <option key={registration.id} value={registration.userId}>
                {registration.user.name || registration.user.email} - {registration.event.title}
              </option>
            ))}
          </select>
          <div className="grid gap-3 md:grid-cols-2">
            <input type="number" name="score" min="0" required placeholder="Score" className="rounded-xl border border-slate-200 px-3 py-2" />
            <input type="number" name="rank" min="1" required placeholder="Rank" className="rounded-xl border border-slate-200 px-3 py-2" />
          </div>
          <Button variant="accent" className="w-fit">Save Result</Button>
        </form>
      </article>

      <article className="card mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {latestEntries.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{entry.event.title}</td>
                  <td className="px-4 py-3">{entry.user.name || entry.user.email}</td>
                  <td className="px-4 py-3"><Badge>#{entry.rank}</Badge></td>
                  <td className="px-4 py-3">{entry.score}</td>
                </tr>
              ))}
              {!latestEntries.length && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No leaderboard entries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

