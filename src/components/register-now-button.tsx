"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { registerForEventAction } from "@/actions/event-actions";
import { Button } from "@/components/ui/button";

export function RegisterNowButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      loading={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await registerForEventAction(eventId);
            toast.success("Registration submitted. Awaiting approval.");
            router.refresh();
          } catch (error) {
            toast.error((error as Error).message);
          }
        });
      }}
    >
      Register Now
    </Button>
  );
}

