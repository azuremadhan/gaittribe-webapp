import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="section-shell py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-extrabold tracking-[0.16em] text-brand-500">GAITTRIB</p>
            <p className="mt-2 text-sm text-muted">
              Play hard, compete smart, and grow through structured weekend sports experiences.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">About</p>
            <p className="mt-3 text-sm text-slate-600">
              GAITTRIB connects athletes to curated events, rankings, and trusted community play.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Contact</p>
            <a href="mailto:hello@gaittrib.com" className="mt-3 block text-sm text-slate-700 hover:text-brand-500">
              hello@gaittrib.com
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Social</p>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-3 block text-sm text-slate-700 hover:text-brand-500">
              Instagram
            </a>
            <Link href="/community" className="mt-1 block text-sm text-slate-700 hover:text-brand-500">
              Community
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
