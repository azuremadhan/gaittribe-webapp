import { getServerSession } from "next-auth";
import Link from "next/link";
import { PaymentButton } from "@/components/payment-button";
import { RegistrationTimeline } from "@/components/registration-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { formatDate, formatINR } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MyRegistrationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <main className="section-shell py-12">
        <div className="card p-8 text-slate-600">
          Please sign in to view your registrations. <Link href="/signin" className="font-semibold text-brand-700">Go to sign in</Link>
        </div>
      </main>
    );
  }

  const registrations = await prisma.registration.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { event: true, payment: true },
  });

  return (
    <main className="section-shell py-10">
      <h1 className="text-3xl font-black">My Registrations</h1>
      <div className="mt-6 space-y-4">
        {registrations.map((registration) => (
          <article key={registration.id} className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{registration.event.title}</h2>
                <p className="text-sm text-slate-500">{formatDate(registration.event.date)} | {registration.event.location}</p>
              </div>
              <Badge variant={registration.status.toLowerCase() as "pending" | "approved" | "rejected" | "confirmed"}>{registration.status}</Badge>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <RegistrationTimeline status={registration.status} />

              {registration.status === "APPROVED" && (
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Payment Summary</p>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p>Total: {formatINR((registration.payment?.amount ?? registration.event.price * 100))}</p>
                    <p>Platform Fee: {formatINR(registration.payment?.platformFee ?? 1500)}</p>
                    <p>Organizer Share: {formatINR(registration.payment?.organizerAmount ?? Math.max(registration.event.price * 100 - 1500, 0))}</p>
                  </div>
                  <div className="mt-4">
                    <PaymentButton registrationId={registration.id} eventTitle={registration.event.title} />
                  </div>
                </div>
              )}

              {registration.status !== "APPROVED" && (
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  Amount: <span className="font-semibold">{formatINR(registration.event.price * 100)}</span>
                </div>
              )}
            </div>
          </article>
        ))}

        {!registrations.length && (
          <div className="card p-8 text-center text-sm text-slate-500">
            <p>No registrations yet. Book your first GAITTRIB event.</p>
            <Link href="/"><Button className="mt-3" size="sm">Explore Events</Button></Link>
          </div>
        )}
      </div>
    </main>
  );
}

