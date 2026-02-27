"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type PaymentButtonProps = {
  registrationId: string;
  eventTitle: string;
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function PaymentButton({ registrationId, eventTitle }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });

      if (!orderRes.ok) {
        throw new Error("Could not create order");
      }

      const { orderId, amount, keyId } = (await orderRes.json()) as {
        orderId: string;
        amount: number;
        keyId: string;
      };

      if (!keyId || !window.Razorpay) {
        toast.error("Razorpay keys or checkout script missing.");
        return;
      }

      const razorpay = new window.Razorpay({
        key: keyId,
        amount,
        currency: "INR",
        name: "GAITTRIB",
        description: eventTitle,
        order_id: orderId,
        notes: { registrationId },
        handler: () => {
          toast.success("Payment started. Confirmation will sync via webhook.");
        },
      });

      razorpay.open();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} loading={loading} variant="accent" size="sm">
      Pay Now
    </Button>
  );
}

