import { createEventAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { EventCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

const CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "RUNNING", label: "🏃 Running" },
  { value: "HYROX", label: "💪 HYROX" },
  { value: "FOOTBALL", label: "⚽ Football" },
  { value: "BADMINTON", label: "🏸 Badminton" },
  { value: "CRICKET", label: "🏏 Cricket" },
  { value: "PICKLEBALL", label: "🎾 Pickleball" },
  { value: "RETREAT", label: "🧘 Retreat" },
  { value: "TOURNAMENT", label: "🏆 Tournament" },
  { value: "OTHER", label: "📌 Other" },
];

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { registrations: true } } },
  });

  return (
    <section>
      <h1 className="text-3xl font-black">Events</h1>

      <article className="card mt-6 p-6">
        <h2 className="text-xl font-bold">Create Event / Trip</h2>
        <form action={createEventAction} className="mt-4 grid gap-3">
          <input name="title" required placeholder="Title" className="rounded-xl border border-slate-200 px-3 py-2" />
          <textarea name="description" required placeholder="Description" className="h-24 rounded-xl border border-slate-200 px-3 py-2" />
          <div className="grid gap-3 md:grid-cols-2">
            <select name="type" className="rounded-xl border border-slate-200 px-3 py-2">
              <option value="FITNESS">Fitness</option>
              <option value="TRIP">Trip</option>
            </select>
            <select name="category" className="rounded-xl border border-slate-200 px-3 py-2">
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <input type="datetime-local" name="date" required className="rounded-xl border border-slate-200 px-3 py-2" />
            <input type="text" name="location" required placeholder="Location" className="rounded-xl border border-slate-200 px-3 py-2" />
            <input type="number" name="price" min="0" required placeholder="Price (INR)" className="rounded-xl border border-slate-200 px-3 py-2" />
            <input type="number" name="capacity" min="1" required placeholder="Capacity" className="rounded-xl border border-slate-200 px-3 py-2" />
          </div>
          <Button className="w-fit">Create Event</Button>
        </form>
      </article>

      <article className="card mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Regs</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-ink">{event.title}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{event.category}</Badge></td>
                  <td className="px-4 py-3"><Badge>{event.type}</Badge></td>
                  <td className="px-4 py-3">{formatDate(event.date)}</td>
                  <td className="px-4 py-3">{event.location}</td>
                  <td className="px-4 py-3">{event._count.registrations}</td>
                </tr>
              ))}
              {!events.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No events created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
