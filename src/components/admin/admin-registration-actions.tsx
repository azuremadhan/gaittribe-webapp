"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { reviewRegistrationAction } from "@/actions/event-actions";
import { Button } from "@/components/ui/button";

export function AdminRegistrationActions({ registrationId }: { registrationId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const decide = (decision: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      try {
        await reviewRegistrationAction(registrationId, decision);
        toast.success(decision === "APPROVED" ? "Registration approved." : "Registration rejected.");
        router.refresh();
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" loading={pending} onClick={() => decide("APPROVED")}>Approve</Button>
      <Button size="sm" loading={pending} variant="danger" onClick={() => decide("REJECTED")}>Reject</Button>
    </div>
  );
}

