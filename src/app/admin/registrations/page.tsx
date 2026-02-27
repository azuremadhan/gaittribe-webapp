import { AdminRegistrationActions } from "@/components/admin/admin-registration-actions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.registration.findMany({
    include: { user: true, event: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <section>
      <h1 className="text-3xl font-black">Registrations</h1>
      <article className="card mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{registration.user.name || registration.user.email}</td>
                  <td className="px-4 py-3">{registration.event.title}</td>
                  <td className="px-4 py-3">{formatDate(registration.createdAt)}</td>
                  <td className="px-4 py-3"><Badge variant={registration.status.toLowerCase() as "pending" | "approved" | "rejected" | "confirmed"}>{registration.status}</Badge></td>
                  <td className="px-4 py-3">
                    {registration.status === "PENDING" ? <AdminRegistrationActions registrationId={registration.id} /> : <span className="text-xs text-slate-400">-</span>}
                  </td>
                </tr>
              ))}
              {!registrations.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No registrations found.</td></tr>}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

