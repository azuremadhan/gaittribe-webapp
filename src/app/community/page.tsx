import { Instagram, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

const testimonials = [
  "GAITTRIB finally gave us a serious platform to play weekly and track progress.",
  "The event quality and clean flow make this feel professional from day one.",
  "I discovered athletes in my city and now we train as a community every weekend.",
];

export default function CommunityPage() {
  return (
    <main className="section-shell">
      <Section title="Community" subtitle="Real athletes. Real events. Real accountability.">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((text, idx) => (
            <article key={idx} className="card border border-slate-200 p-6">
              <p className="text-sm text-slate-600">�{text}�</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">GAITTRIB Member</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Gallery" subtitle="Moments from curated sessions and weekend competition.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card aspect-[4/3] border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-3 text-xs font-semibold text-muted">
              GAITTRIB MOMENT {i + 1}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Social Proof" subtitle="Trusted by growing athlete communities across cities.">
        <div className="card border border-slate-200 p-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Users size={16} /> Trusted by 500+ athletes</p>
          <p className="mt-2 text-sm text-muted">Join community-led events and measurable competition formats.</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-4 inline-block">
            <Button variant="outline" size="sm"><Instagram size={14} /> Instagram</Button>
          </a>
        </div>
      </Section>
    </main>
  );
}
