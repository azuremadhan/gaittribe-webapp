import Link from "next/link";
import { getServerSession } from "next-auth";
import { Trophy, TrendingUp, Users } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const testimonials = [
  { name: "Aditi S.", text: "From registration to final rank, everything feels premium and organized." },
  { name: "Rahul V.", text: "No more WhatsApp confusion. Events now run like a proper sports league." },
  { name: "Nikhil P.", text: "The leaderboard keeps me accountable every single week." },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const [upcomingEvents, leaderboardPreview] = await Promise.all([
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 6,
      include: { _count: { select: { registrations: true } } },
    }),
    prisma.leaderboard.findMany({
      orderBy: [{ score: "desc" }, { rank: "asc" }],
      take: 3,
      include: { user: true, event: true },
    }),
  ]);

  const hostHref = session?.user?.role === "ADMIN" ? "/admin/events" : "/signin?next=/admin/events";

  return (
    <main className="section-shell">
      <Hero hostHref={hostHref} />

      <Section
        id="events"
        title="Featured Events"
        subtitle="Book your slot. Show up. Compete. Repeat."
        className="rounded-3xl border border-white/10 bg-background-secondary/50 px-4 sm:px-6"
      >
        {!upcomingEvents.length ? (
          <div className="card p-8 text-center text-sm text-text-secondary">No upcoming events yet.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Leaderboard Snapshot" subtitle="Top performers this week across active events.">
        <div className="grid gap-4 lg:grid-cols-3">
          {leaderboardPreview.map((entry) => (
            <Link key={entry.id} href={`/events/${entry.eventId}/leaderboard`} className="card surface-hover p-6">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <Trophy size={14} /> Rank #{entry.rank}
              </p>
              <p className="mt-3 text-lg font-bold text-white">{entry.user.name || entry.user.email}</p>
              <p className="mt-1 text-sm text-text-secondary">{entry.score} pts · {entry.event.title}</p>
            </Link>
          ))}
          {!leaderboardPreview.length && <p className="card p-6 text-sm text-text-secondary">No ranking data yet.</p>}
        </div>
      </Section>

      <Section title="Why athletes stay with GAITTRIB" subtitle="A sports-first platform built for consistency, not chaos.">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="card p-6">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white"><Users size={16} /> Strong Local Network</p>
            <p className="mt-2 text-sm text-text-secondary">Chennai athletes across multiple formats and levels.</p>
          </article>
          <article className="card p-6">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white"><TrendingUp size={16} /> Real Progress Tracking</p>
            <p className="mt-2 text-sm text-text-secondary">Transparent scores, visible rank improvements, and event-level performance.</p>
          </article>
          <article className="card p-6">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white"><Trophy size={16} /> Premium Competition Layer</p>
            <p className="mt-2 text-sm text-text-secondary">Elite event experience without losing community feel.</p>
          </article>
        </div>
      </Section>

      <Section title="Community Feedback" subtitle="What regular participants say after moving from manual flows.">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="card p-6">
              <p className="text-sm text-text-secondary">“{item.text}”</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-text-secondary">{item.name}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/leaderboard"><Button variant="outline">View Full Leaderboard</Button></Link>
          <Link href="/community"><Button>Explore Community</Button></Link>
        </div>
      </Section>
    </main>
  );
}
