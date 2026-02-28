import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0c10]">
      <div className="section-shell py-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>
            <p className="text-xl font-bold text-white">GAITTRIB</p>
            <p className="mt-2 text-sm text-zinc-500">Chennai's most active fitness community</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">Explore</Link>
            <Link href="/leaderboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/community" className="text-sm text-zinc-400 hover:text-white transition-colors">Community</Link>
          </div>
          
          <p className="text-xs text-zinc-600">© 2026 GAITTRIB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
