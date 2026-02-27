import { RegistrationStatus } from "@prisma/client";

const steps: RegistrationStatus[] = ["PENDING", "APPROVED", "CONFIRMED"];

export function RegistrationTimeline({ status }: { status: RegistrationStatus }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Status Timeline</p>
      <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm">
        {steps.map((step, idx) => {
          const active = steps.indexOf(status) >= idx || (status === "REJECTED" && step === "PENDING");
          return (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${active ? "bg-brand-500" : "bg-slate-300"}`} />
              <span className={`${active ? "text-ink" : "text-slate-400"}`}>{step}</span>
              {idx < steps.length - 1 && <div className="h-px flex-1 bg-slate-300" />}
            </div>
          );
        })}
      </div>
      {status === "APPROVED" && <p className="mt-3 text-xs text-brand-700">Payment step is active.</p>}
      {status === "REJECTED" && <p className="mt-3 text-xs text-rose-600">Registration was rejected by organizer.</p>}
    </div>
  );
}

