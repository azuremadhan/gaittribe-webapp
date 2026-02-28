"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, Menu, Trophy, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const LOGO_PRIMARY = "/icon.svg";

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
    `text-sm font-medium transition-colors ${
      pathname === href ? "text-[#e8c547]" : "text-zinc-400 hover:text-white"
    }`;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-xl">
      <div className="section-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 overflow-hidden rounded-lg bg-[#e8c547]">
            <img src={LOGO_PRIMARY} alt="GAITTRIB" className="h-full w-full object-cover" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">GAITTRIB</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                <Icon size={16} className="mr-1.5 inline" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors hover:bg-zinc-700"
              >
                <User size={16} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-xl border border-white/[0.06] bg-[#161a23] p-1.5 shadow-xl">
                  <Link href="/my-registrations" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/[0.04]">My Events</Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/[0.04]">
                      <LayoutDashboard size={14} /> Admin
                    </Link>
                  )}
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-white/[0.04]">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signin" className="text-sm font-medium text-zinc-300 hover:text-white">
              Sign in
            </Link>
          )}
        </div>

        <button className="p-2 text-zinc-400 md:hidden" onClick={() => setOpen((prev) => !prev)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.06] bg-[#0a0c10] md:hidden">
          <div className="section-shell flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={`${linkClass(item.href)} rounded-lg px-3 py-2`} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {status === "authenticated" ? (
              <>
                <Link href="/my-registrations" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-zinc-300">My Events</Link>
                {isAdmin && <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-zinc-300">Admin</Link>}
                <button onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }} className="rounded-lg px-3 py-2 text-left text-sm text-red-400">Logout</button>
              </>
            ) : (
              <Link href="/signin" onClick={() => setOpen(false)} className="text-sm font-medium text-zinc-300">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
