import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "secondary" | "ghost" | "danger" | "accent";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantMap: Record<ButtonVariant, string> = {
  primary: "bg-[#e8c547] text-[#0a0c10] hover:bg-[#f0d36a]",
  outline: "border border-white/[0.15] bg-transparent text-white hover:border-white/[0.3] hover:bg-white/[0.03]",
  secondary: "bg-[#161a23] text-zinc-300 hover:bg-[#1e2330]",
  ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.04]",
  danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
  accent: "bg-[#e8c547] text-[#0a0c10] hover:bg-[#f0d36a]",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
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
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      {...props}
    >
      {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
