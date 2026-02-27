"use client";

import Link from "next/link";
import { Compass, Menu, Trophy, User, Users, X } from "lucide-react";
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
      if (!menuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const linkClass = (href: string) =>
    `inline-flex items-center gap-2 text-sm font-medium transition duration-200 ${
      pathname === href ? "text-[#1E90FF]" : "text-[#94A3B8] hover:text-[#00C2FF]"
    }`;

  return (
    <header className="fixed top-0 z-40 h-[70px] w-full border-b border-white/5 bg-[rgba(11,18,32,0.8)] px-4 backdrop-blur-lg sm:px-8">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src={LOGO_PRIMARY}
            alt="GAITTRIB logo"
            className="h-9 w-9 rounded-md object-contain"
            onError={(event) => {
              const target = event.currentTarget;
              if (target.src.endsWith(LOGO_FALLBACK)) return;
              target.src = LOGO_FALLBACK;
            }}
          />
          <div className="leading-tight">
            <p className="text-base font-extrabold tracking-[0.12em] text-white">GAITTRIB</p>
            <p className="text-[11px] font-medium text-[#64748B]">Sports Community Platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {status === "authenticated" ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#F1F5F9] transition duration-200 hover:border-[#00C2FF]"
                aria-label="Open profile menu"
              >
                <User size={18} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 min-w-[200px] rounded-xl border border-white/10 bg-[#111827] p-1 shadow-xl">
                  <Link
                    href="/complete-profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-[#F1F5F9] transition duration-200 hover:bg-[rgba(30,144,255,0.1)]"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/my-registrations"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-[#F1F5F9] transition duration-200 hover:bg-[rgba(30,144,255,0.1)]"
                  >
                    My Registrations
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-[#F1F5F9] transition duration-200 hover:bg-[rgba(30,144,255,0.1)]"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#F1F5F9] transition duration-200 hover:bg-[rgba(30,144,255,0.1)]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-[#F1F5F9] transition duration-200 hover:bg-white/10"
            >
              Login / Signup
            </Link>
          )}
        </div>

        <button
          className="rounded-xl border border-white/15 p-2 text-[#F1F5F9] lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0F172A] lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-8">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClass(item.href)}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {status === "authenticated" ? (
              <>
                <Link
                  href="/complete-profile"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-[#F1F5F9] transition duration-200 hover:bg-[rgba(30,144,255,0.1)]"
                >
                  Profile
                </Link>
                <Link
                  href="/my-registrations"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-[#F1F5F9] transition duration-200 hover:bg-[rgba(30,144,255,0.1)]"
                >
                  My Registrations
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-2 text-sm font-medium text-[#F1F5F9] transition duration-200 hover:bg-[rgba(30,144,255,0.1)]"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="rounded-lg px-2 py-2 text-left text-sm font-medium text-[#F1F5F9] transition duration-200 hover:bg-[rgba(30,144,255,0.1)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="inline-flex w-fit rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-[#F1F5F9] transition duration-200 hover:bg-white/10"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
