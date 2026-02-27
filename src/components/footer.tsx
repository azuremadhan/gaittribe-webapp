import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0b1220]/80 backdrop-blur">
      <div className="section-shell py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-black tracking-[0.24em] text-white">GAITTRIB</p>
            <p className="mt-3 text-sm text-text-secondary">
              Every sport. Every level. Every weekend. Premium event experience for Chennai athletes.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-secondary">Platform</p>
            <p className="mt-3 text-sm text-slate-300">Structured registrations, verified rankings, and curated events.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-secondary">Contact</p>
            <a href="mailto:hello@gaittrib.com" className="mt-3 block text-sm text-slate-200 hover:text-accent-glow">
              hello@gaittrib.com
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-secondary">Explore</p>
            <Link href="/community" className="mt-3 block text-sm text-slate-200 hover:text-accent-glow">Community</Link>
            <Link href="/leaderboard" className="mt-1 block text-sm text-slate-200 hover:text-accent-glow">Leaderboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
