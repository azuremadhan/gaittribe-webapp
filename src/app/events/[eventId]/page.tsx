import Link from "next/link";
import { getServerSession } from "next-auth";
import { RegisterNowButton } from "@/components/register-now-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { formatDate, formatINR } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: { eventId: string };
};

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: PageProps) {
  const [event, session] = await Promise.all([
    prisma.event.findUnique({
      where: { id: params.eventId },
      include: { _count: { select: { registrations: true } } },
    }),
    getServerSession(authOptions),
  ]);

  if (!event) {
    return <main className="section-shell py-12">Event not found.</main>;
  }

  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;

  const registration = session?.user
    ? await prisma.registration.findUnique({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: event.id,
          },
        },
      })
    : null;

  const spotsLeft = Math.max(event.capacity - event._count.registrations, 0);

  return (
    <>
      <main className="section-shell py-10">
        <article className="card p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge>{event.type}</Badge>
            <span className="text-sm text-slate-500">{formatDate(event.date)}</span>
          </div>
          <h1 className="mt-4 text-4xl font-black text-ink">{event.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{event.location}</p>
          <p className="mt-4 text-slate-600">{event.description}</p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-black text-accent-500">{formatINR(event.price * 100)}</p>
              <p className="text-sm text-slate-500">{spotsLeft} spots left</p>
            </div>

            <div className="hidden sm:block">
              {!session?.user && <Link href="/signin"><Button>Sign in to register</Button></Link>}
              {session?.user && user && !user.profileCompleted && (
                <Link href={`/complete-profile?next=/events/${event.id}`}><Button variant="accent">Complete Profile</Button></Link>
              )}
              {session?.user && user?.profileCompleted && !registration && <RegisterNowButton eventId={event.id} />}
              {registration && <Badge variant={registration.status.toLowerCase() as "pending" | "approved" | "rejected" | "confirmed"}>Status: {registration.status}</Badge>}
            </div>
          </div>

          <Link href={`/events/${event.id}/leaderboard`} className="mt-8 inline-flex text-sm font-semibold text-brand-700 underline">
            View leaderboard
          </Link>
        </article>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 sm:hidden">
        <div className="section-shell flex items-center justify-between">
          <p className="text-sm font-bold text-ink">{formatINR(event.price * 100)}</p>
          {!session?.user && <Link href="/signin"><Button size="sm">Sign in</Button></Link>}
          {session?.user && user && !user.profileCompleted && (
            <Link href={`/complete-profile?next=/events/${event.id}`}><Button size="sm" variant="accent">Complete Profile</Button></Link>
          )}
          {session?.user && user?.profileCompleted && !registration && <RegisterNowButton eventId={event.id} />}
          {registration && <Badge variant={registration.status.toLowerCase() as "pending" | "approved" | "rejected" | "confirmed"}>{registration.status}</Badge>}
        </div>
      </div>
    </>
  );
}

