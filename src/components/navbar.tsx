"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass, LayoutDashboard, Menu, Trophy, User, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/community", label: "Community", icon: Users },
];

const LOGO_PRIMARY = "/gait tribe-logo.png";
const LOGO_FALLBACK = "/icon.svg";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = (href: string) =>
    `inline-flex items-center gap-2 text-sm font-semibold transition ${
      pathname === href ? "text-white" : "text-text-secondary hover:text-accent-glow"
    }`;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0b1220]/85 backdrop-blur-xl">
      <div className="section-shell flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/20 bg-white/5">
            <Image src={LOGO_PRIMARY} alt="GAITTRIB logo" fill className="object-cover" onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.src = LOGO_FALLBACK;
            }} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-black tracking-[0.24em] text-white">GAITTRIB</p>
            <p className="text-[11px] text-text-secondary">Every sport. Every weekend.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {status === "authenticated" ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:border-[#00C2FF]"
                aria-label="Open profile menu"
              >
                <User size={18} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 min-w-[220px] rounded-2xl border border-white/10 bg-[#0f172a] p-2 shadow-2xl">
                  <Link href="/complete-profile" onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-white/5">Profile</Link>
                  <Link href="/my-registrations" onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-white/5">My Registrations</Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-white/5">
                      <LayoutDashboard size={15} /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-rose-200 hover:bg-rose-500/10">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signin" className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-[#00C2FF]">
              Login / Signup
            </Link>
          )}
        </div>

        <button className="rounded-xl border border-white/15 p-2 text-white lg:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0b1220] lg:hidden">
          <div className="section-shell flex flex-col gap-2 py-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={`${linkClass(item.href)} rounded-lg px-2 py-2`} onClick={() => setOpen(false)}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {status === "authenticated" ? (
              <>
                <Link href="/complete-profile" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm text-white/90">Profile</Link>
                <Link href="/my-registrations" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm text-white/90">My Registrations</Link>
                {isAdmin && <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm text-white/90">Admin Dashboard</Link>}
                <button onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }} className="rounded-lg px-2 py-2 text-left text-sm text-rose-200">Logout</button>
              </>
            ) : (
              <Link href="/signin" onClick={() => setOpen(false)} className="inline-flex w-fit rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white">Login / Signup</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
