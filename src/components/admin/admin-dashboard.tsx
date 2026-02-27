import { DollarSign, Trophy, TrendingUp, Users } from "lucide-react";
import { RegistrationBarChart, EventTypePieChart } from "@/components/charts/admin-charts";

type Stat = {
  title: string;
  value: string;
};

const statIcons = [Trophy, Users, DollarSign, TrendingUp];

export function AdminDashboard({
  stats,
  eventLabels,
  registrationValues,
  fitnessCount,
  tripCount,
}: {
  stats: Stat[];
  eventLabels: string[];
  registrationValues: number[];
  fitnessCount: number;
  tripCount: number;
}) {
  return (
    <section>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Admin Overview</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = statIcons[index] ?? TrendingUp;
          return (
            <article key={stat.title} className="card surface-hover border border-slate-200 p-5">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <Icon size={14} /> {stat.title}
              </p>
              <p className="mt-3 text-2xl font-extrabold text-ink">{stat.value}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="card border border-slate-200 p-5">
          <h2 className="text-base font-bold text-ink">Registrations per Event</h2>
          <p className="mt-1 text-xs text-muted">Weekly registration trend by event.</p>
          <div className="mt-4 h-[280px]">
            <RegistrationBarChart labels={eventLabels} values={registrationValues} />
          </div>
        </article>
        <article className="card border border-slate-200 p-5">
          <h2 className="text-base font-bold text-ink">Event Type Distribution</h2>
          <p className="mt-1 text-xs text-muted">Share of fitness and trip events.</p>
          <div className="mt-4 h-[280px]">
            <EventTypePieChart fitness={fitnessCount} trip={tripCount} />
          </div>
        </article>
      </div>
    </section>
  );
}
