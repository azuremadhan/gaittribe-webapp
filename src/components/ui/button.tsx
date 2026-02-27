import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "secondary" | "ghost" | "danger" | "accent";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,#1E90FF,#00C2FF)] text-white shadow-glow hover:scale-[1.03] hover:shadow-[0_12px_30px_rgba(0,194,255,0.4)]",
  outline:
    "border border-white/20 bg-transparent text-text-primary hover:bg-[rgba(30,144,255,0.1)]",
  secondary: "bg-background-secondary text-text-primary hover:bg-card-bg",
  ghost: "bg-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary",
  danger: "bg-rose-500 text-white hover:bg-rose-600",
  accent:
    "bg-[linear-gradient(135deg,#1E90FF,#00C2FF)] text-white shadow-glow hover:scale-[1.03] hover:shadow-[0_12px_30px_rgba(0,194,255,0.4)]",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`group relative overflow-hidden rounded-xl font-semibold transition-all duration-300 ease-out disabled:opacity-60 ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.2) 45%, transparent 100%)" }} />
      <span className="relative inline-flex items-center gap-2">
        {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/50 border-t-white" />}
        {children}
      </span>
    </button>
  );
}

