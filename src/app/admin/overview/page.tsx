import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getMostConsistentUsers } from "@/lib/analytics";
import { formatINR } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [totalEvents, totalRegistrations, revenue, mostConsistent, events] = await Promise.all([
    prisma.event.count(),
    prisma.registration.count(),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    getMostConsistentUsers(1),
    prisma.event.findMany({
      include: { _count: { select: { registrations: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const stats = [
    { title: "Total Events", value: totalEvents.toString() },
    { title: "Total Registrations", value: totalRegistrations.toString() },
    { title: "Total Revenue", value: formatINR(revenue._sum.amount ?? 0) },
    { title: "Top Player", value: mostConsistent[0] ? `${mostConsistent[0].name || mostConsistent[0].email}` : "N/A" },
  ];

  const eventLabels = events.map((event) => event.title);
  const registrationValues = events.map((event) => event._count.registrations);
  const fitnessCount = events.filter((event) => event.type === "FITNESS").length;
  const tripCount = events.filter((event) => event.type === "TRIP").length;

  return (
    <AdminDashboard
      stats={stats}
      eventLabels={eventLabels}
      registrationValues={registrationValues}
      fitnessCount={fitnessCount}
      tripCount={tripCount}
    />
  );
}

