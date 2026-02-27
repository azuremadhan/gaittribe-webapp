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
          {title && <h2 className="text-3xl font-extrabold uppercase tracking-wide text-ink">{title}</h2>}
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
