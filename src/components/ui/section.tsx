import type { ReactNode } from "react";

export function Section({
  id,
  className = "",
  title,
  subtitle,
  children,
}: {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`section-block ${className}`}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <>
              <div className="mb-3 h-1 w-14 rounded-full bg-gradient-to-r from-accent-primary to-accent-glow" />
              <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">{title}</h2>
            </>
          )}
          {subtitle && <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
