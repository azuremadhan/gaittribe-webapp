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
  { name: "Aditi S.", text: "Weekend events now feel structured, premium, and truly community-driven." },
  { name: "Rahul V.", text: "From booking to leaderboard, GAITTRIB feels like a serious sports platform." },
  { name: "Nikhil P.", text: "The quality of events and competition keeps me consistent every week." },
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

      <Section className="pt-0 reveal-up">
        <div className="mx-auto max-w-3xl rounded-full border border-white/10 bg-card-bg px-6 py-3 text-center text-sm font-semibold text-text-secondary shadow-soft">
          Trusted by 500+ athletes | 50+ events hosted | Live verified rankings
        </div>
      </Section>

      <Section
        id="events"
        title="Featured Events"
        subtitle="Marketplace-grade sports experiences with transparent availability and fair competition."
        className="reveal-up rounded-3xl bg-background-secondary/75 px-4 sm:px-6"
      >
        {!upcomingEvents.length ? (
          <div className="card p-8 text-center text-sm text-muted">No upcoming events yet.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Categories" subtitle="Choose your preferred format and stay active every weekend." className="reveal-up">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="card p-6 surface-hover">
            <h3 className="text-xl font-extrabold text-ink">Fitness Events</h3>
            <p className="mt-2 text-sm text-muted">High-energy training sessions, runs, and performance workouts.</p>
          </article>
          <article className="card p-6 surface-hover">
            <h3 className="text-xl font-extrabold text-ink">Trips</h3>
            <p className="mt-2 text-sm text-muted">Curated adventure and team outings for long-format community play.</p>
          </article>
        </div>
      </Section>

      <Section title="Leaderboard Snapshot" subtitle="Top athletes this week based on verified event performance." className="reveal-up">
        <div className="grid gap-4 lg:grid-cols-3">
          {leaderboardPreview.map((entry) => (
            <Link
              key={entry.id}
              href={`/events/${entry.eventId}/leaderboard`}
              className="card surface-hover p-6"
            >
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <Trophy size={14} /> Rank #{entry.rank}
              </p>
              <p className="mt-3 text-lg font-bold text-ink">{entry.user.name || entry.user.email}</p>
              <p className="mt-1 text-sm text-muted">{entry.score} pts - {entry.event.title}</p>
            </Link>
          ))}
          {!leaderboardPreview.length && <p className="card p-6 text-sm text-muted">No ranking data yet.</p>}
        </div>
      </Section>

      <Section title="Testimonials" subtitle="What the community says about GAITTRIB experience." className="reveal-up">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="card p-6">
              <p className="text-sm text-text-secondary">&quot;{item.text}&quot;</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">{item.name}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Community Highlights" subtitle="Built for trust, consistency, and measurable progress." className="reveal-up">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="card p-6">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Users size={16} /> Strong Network</p>
            <p className="mt-2 text-sm text-muted">500+ athletes actively participating in weekly formats.</p>
          </article>
          <article className="card p-6">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><TrendingUp size={16} /> Real Progress</p>
            <p className="mt-2 text-sm text-muted">Transparent scoring and ranking progression across events.</p>
          </article>
          <article className="card p-6">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Trophy size={16} /> Competitive Edge</p>
            <p className="mt-2 text-sm text-muted">Structured competition without sacrificing community spirit.</p>
          </article>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/leaderboard"><Button variant="outline">View Full Leaderboard</Button></Link>
          <Link href="/community"><Button>Explore Community</Button></Link>
        </div>
      </Section>
    </main>
  );
}
