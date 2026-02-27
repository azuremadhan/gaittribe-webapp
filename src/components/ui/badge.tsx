import type { ReactNode } from "react";

type BadgeVariant = "open" | "full" | "closed" | "pending" | "approved" | "rejected" | "confirmed" | "default";

const styleMap: Record<BadgeVariant, string> = {
  open: "border-emerald-300/30 bg-emerald-300/15 text-emerald-200",
  full: "border-orange-300/30 bg-orange-300/15 text-orange-200",
  closed: "border-white/15 bg-white/10 text-text-secondary",
  pending: "border-white/15 bg-white/10 text-text-secondary",
  approved: "border-cyan-300/30 bg-cyan-300/15 text-cyan-200",
  rejected: "border-rose-300/30 bg-rose-300/15 text-rose-200",
  confirmed: "border-cyan-300/30 bg-cyan-300/15 text-cyan-200",
  default: "border-white/15 bg-white/10 text-text-secondary",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${styleMap[variant]} ${className}`}>
      {children}
    </span>
  );
}

