import { prisma } from "@/lib/prisma";
import { getRazorpayClient } from "@/lib/razorpay";

const PLATFORM_FEE_PAISE = 1500;

export async function ensurePaymentOrder(registrationId: string) {
  const existing = await prisma.payment.findUnique({
    where: { registrationId },
  });

  if (existing) return existing;

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { event: true },
  });

  if (!registration || registration.status !== "APPROVED") {
    throw new Error("Registration not approved for payment");
  }

  const amount = registration.event.price * 100;
  const platformFee = Math.min(PLATFORM_FEE_PAISE, amount);
  const organizerAmount = Math.max(amount - platformFee, 0);

  const razorpay = getRazorpayClient();
  let razorpayOrderId = `mock_${registrationId}`;

  if (razorpay) {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: registration.id,
      notes: { registrationId: registration.id, eventId: registration.eventId },
    });
    razorpayOrderId = order.id;
  }

  return prisma.payment.create({
    data: {
      registrationId,
      razorpayOrderId,
      amount,
      platformFee,
      organizerAmount,
      status: "CREATED",
    },
  });
}
