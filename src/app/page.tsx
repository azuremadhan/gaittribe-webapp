import Link from "next/link";
import { getServerSession } from "next-auth";
import { Trophy, ArrowRight } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { Hero } from "@/components/hero";
import { Section } from "@/components/ui/section";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const testimonials = [
  { name: "Aishwarya G.", text: "From HYROX training to the Thailand retreat — GAITTRIB keeps me consistent.", sport: "HYROX" },
  { name: "Jagan K.", text: "No more WhatsApp chaos. Events now run like a proper sports league.", sport: "Running" },
  { name: "Sabreesh M.", text: "The leaderboard keeps me accountable every single week.", sport: "Badminton" },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  const [upcomingEvents, leaderboardPreview] = await Promise.all([
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 6,
      include: { _count: { select: { registrations: true } } },
    }),
    prisma.leaderboard.findMany({
      orderBy: [{ score: "desc" }, { rank: "asc" }],
      take: 5,
      include: { user: true, event: true },
    }),
  ]);

  const hostHref = isAdmin ? "/admin/events" : "/signin?next=/admin/events";

  return (
    <main className="section-shell">
      <Hero hostHref={hostHref} isAdmin={isAdmin} />

      <Section id="events">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Upcoming Events</h2>
            <p className="mt-1.5 text-sm text-zinc-500">Join the weekend's best events.</p>
          </div>
        </div>

        {!upcomingEvents.length ? (
          <div className="card p-12 text-center">
            <p className="text-zinc-500">No events scheduled yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Section>

      {/* Leaderboard Preview Panel */}
      <Section>
        <div className="card overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#12151c] to-[#0a0c10] p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8c547]/20">
                <Trophy size={20} className="text-[#e8c547]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
                <p className="text-xs text-zinc-500">Top performers this month</p>
              </div>
            </div>
            <Link href="/leaderboard" className="flex items-center gap-1 text-sm font-medium text-[#e8c547] transition-colors hover:text-[#f0d36a]">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-5">
            {leaderboardPreview.slice(0, 5).map((entry, idx) => (
              <Link 
                key={entry.id} 
                href="/leaderboard"
                className="group flex items-center gap-3 rounded-xl bg-white/[0.02] p-3 transition-all hover:bg-white/[0.05]"
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  idx === 0 ? "bg-[#e8c547] text-black" : 
                  idx === 1 ? "bg-zinc-500 text-white" : 
                  idx === 2 ? "bg-amber-700 text-white" : 
                  "bg-zinc-800 text-zinc-400"
                }`}>
                  {entry.rank}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{entry.user.name || "Athlete"}</p>
                  <p className="text-xs text-zinc-500">{entry.score} pts</p>
                </div>
              </Link>
            ))}
            {leaderboardPreview.length === 0 && (
              <p className="col-span-5 py-4 text-center text-sm text-zinc-500">No rankings yet. Be the first!</p>
            )}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white">What Athletes Say</h2>
          <p className="mt-1.5 text-sm text-zinc-500">Real feedback from our community</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="card p-5">
              <p className="text-sm text-zinc-300">"{item.text}"</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs font-medium text-white">{item.name}</p>
                <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[10px] text-zinc-400">{item.sport}</span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* CTA - Only for non-admin */}
      {!isAdmin && (
        <Section>
          <div className="card overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#12151c] to-[#0a0c10] p-10 lg:p-14">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold text-white lg:text-3xl">Ready to join the weekend?</h2>
              <p className="mt-3 text-zinc-400">Join Chennai's most active sports community.</p>
              <div className="mt-8">
                <Link href="/signin" className="btn-primary">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </Section>
      )}
    </main>
  );
}
